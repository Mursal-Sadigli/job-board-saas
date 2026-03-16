import prisma from '../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { UserRole } from '@prisma/client';
import { Request, Response } from 'express';

export const syncUser = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.userId || req.auth?.sessionClaims?.sub;
    
    console.log('--- User Sync Started ---');
    console.log('Clerk ID:', clerkId);

    if (!clerkId) {
      console.error('User sync error: No Clerk ID found in request auth.');
      return res.status(401).json({ message: 'Unauthorized - No Clerk ID' });
    }

    // Attempt to get user data from session claims first
    let email = req.auth?.sessionClaims?.email;
    let firstName = req.auth?.sessionClaims?.first_name || req.auth?.sessionClaims?.firstName;
    let lastName = req.auth?.sessionClaims?.last_name || req.auth?.sessionClaims?.lastName;
    let name = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null;
    let role = (req.auth?.sessionClaims?.metadata?.role?.toUpperCase() as UserRole) || UserRole.CANDIDATE;

    // FALLBACK: If email is missing from JWT, fetch it directly from Clerk API
    if (!email) {
      console.log('Email missing from JWT, fetching from Clerk API...');
      try {
        const clerkUser = await clerkClient.users.getUser(clerkId);
        email = clerkUser.emailAddresses?.[0]?.emailAddress;
        firstName = clerkUser.firstName;
        lastName = clerkUser.lastName;
        name = `${firstName || ''} ${lastName || ''}`.trim() || null;
        const metaRole = clerkUser.publicMetadata?.role as string | undefined;
        role = (metaRole?.toUpperCase() as UserRole) || UserRole.CANDIDATE;
        console.log(`Fetched from Clerk API: Email=${email}, Role=${role}`);
      } catch (clerkError: any) {
        console.error('Error fetching user from Clerk API:', clerkError.message);
      }
    }

    if (!email) {
      console.warn('Warning: Email still missing after Clerk API fallback. Using temporary fallback to prevent DB crash.');
      email = `user_${clerkId}@temporary.clerk`;
    }

    // --- DEEP SYNC LOGIC ---
    // 1. Try to find user by clerkId
    let userByClerk = await prisma.user.findUnique({
      where: { clerkId },
      include: { resumes: true }
    });

    // 2. Try to find user by email
    let userByEmail = await prisma.user.findUnique({
      where: { email },
      include: { resumes: true }
    });

    let finalUser;

    if (userByClerk && userByEmail && userByClerk.id !== userByEmail.id) {
      // CONFLICT: We have two different records for this identity.
      console.log('--- CONFLICT DETECTED ---');
      console.log(`Merging user ${userByClerk.id} into ${userByEmail.id}`);
      
      // IMPORTANT: To avoid "Unique constraint failed on clerkId" during update,
      // we must first unset or change the clerkId on the record we are about to discard.
      await prisma.user.update({
        where: { id: userByClerk.id },
        data: { clerkId: `OLD_${clerkId}_${Date.now()}` }
      });

      // Now we can safely update the record that has the email to have this clerkId.
      finalUser = await prisma.user.update({
        where: { id: userByEmail.id },
        data: {
          clerkId: clerkId,
          name: name || userByEmail.name,
          firstName: firstName || userByEmail.firstName,
          lastName: lastName || userByEmail.lastName,
          role: role || userByEmail.role,
          updatedAt: new Date()
        },
        include: { resumes: true }
      });

      // Cleanup
      await prisma.user.delete({ where: { id: userByClerk.id } }).catch(e => console.error('Cleanup error:', e));
      console.log('Conflict resolved and redundant record deleted.');

    } else if (userByClerk) {
      // Normal case: Update existing clerk record
      finalUser = await prisma.user.update({
        where: { clerkId },
        data: {
          email: email,
          name: name,
          firstName: firstName,
          lastName: lastName,
          role: role,
          updatedAt: new Date()
        },
        include: { resumes: true }
      });
      console.log('Updated existing user by Clerk ID');
    } else if (userByEmail) {
      // Link existing email account to this new Clerk ID
      finalUser = await prisma.user.update({
        where: { email },
        data: {
          clerkId: clerkId,
          name: name || userByEmail.name,
          firstName: firstName || userByEmail.firstName,
          lastName: lastName || userByEmail.lastName,
          role: role || userByEmail.role,
          updatedAt: new Date()
        },
        include: { resumes: true }
      });
      console.log('Linked existing email user to new Clerk ID');
    } else {
      // Create new user
      finalUser = await prisma.user.create({
        data: {
          clerkId,
          email,
          name,
          firstName,
          lastName,
          role
        },
        include: { resumes: true }
      });
      console.log('Created brand new user record');
    }

    console.log('User sync successful for DB ID:', finalUser.id, 'Email:', finalUser.email);

    res.status(200).json({
      ...finalUser,
      resumes: finalUser.resumes
    });
  } catch (error: any) {
    console.error('--- User Sync Detailed Error ---');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    // Prisma unikal məhdudiyyət xətası (P2002)
    if (error.code === 'P2002') {
      const field = error.meta?.target || 'məlum olmayan sahə';
      return res.status(409).json({ 
        message: `Məlumat toqquşması: ${field} artıq istifadə olunur.`, 
        error: error.message,
        target: field
      });
    }

    res.status(500).json({ 
      message: 'İstifadəçi sinxronizasiyası zamanı daxili xəta baş verdi', 
      error: error.message,
      code: error.code 
    });
  }
};

export const uploadUserResume = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.sessionClaims?.sub as string;
    if (!clerkId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { resumes: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }

    // Limit yoxlanışı: 5 limit və FREE plan
    if (user.cvUploadCount >= 5 && user.plan === 'FREE') {
      return res.status(403).json({ 
        message: 'Limit bitib. Daha çox CV yükləmək üçün Premium paketinə keçin.',
        code: 'LIMIT_REACHED'
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Fayl seçilməyib' });
    }

    // Cloudinary upload (already handled by multer-storage-cloudinary or we can do it manually)
    // Assuming we use memory storage and upload manually to have full control
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'user-resumes',
      resource_type: 'auto',
    });

    // Save to database
    const newResume = await prisma.resume.create({
      data: {
        userId: user.id,
        name: req.file.originalname,
        size: req.file.size,
        url: uploadResponse.secure_url,
      }
    });

    // Update upload count
    await prisma.user.update({
      where: { id: user.id },
      data: {
        cvUploadCount: { increment: 1 }
      }
    });

    res.status(201).json(newResume);
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: 'CV yüklənərkən xəta baş verdi' });
  }
};

export const getUserResumes = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.sessionClaims?.sub as string;
    if (!clerkId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { resumes: { orderBy: { createdAt: 'desc' } } }
    });

    if (!user) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }

    res.status(200).json({
      resumes: user.resumes,
      cvUploadCount: user.cvUploadCount,
      plan: user.plan
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'CV-ləri gətirərkən xəta baş verdi' });
  }
};

export const deleteUserResume = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const clerkId = req.auth?.sessionClaims?.sub as string;

    const resume = await prisma.resume.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!resume || resume.user.clerkId !== clerkId) {
      return res.status(404).json({ message: 'CV tapılmadı' });
    }

    // Optional: Delete from Cloudinary
    const publicId = resume.url.split('/upload/v')[1].split('/').slice(1).join('.').split('.')[0];
    await cloudinary.uploader.destroy('user-resumes/' + publicId, { resource_type: 'raw' });

    await prisma.resume.delete({
      where: { id }
    });

    res.status(200).json({ message: 'CV silindi' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'CV silinərkən xəta baş verdi' });
  }
};

export const updateUserProfile = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.sessionClaims?.sub as string;
    if (!clerkId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { 
      firstName, lastName, title, bio, location, phone, 
      skills, experience, education, socialLinks, telegramId
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: {
        firstName,
        lastName,
        name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
        title,
        bio,
        location,
        phone,
        telegramId,
        skills: Array.isArray(skills) ? skills : undefined,
        experience: experience || undefined,
        education: education || undefined,
        socialLinks: socialLinks || undefined,
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Profil yenilənərkən xəta baş verdi' });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.sessionClaims?.sub as string;
    if (!clerkId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Profil məlumatlarını gətirərkən xəta baş verdi' });
  }
};

export const updateNotificationSettings = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.sessionClaims?.sub as string;
    if (!clerkId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { notificationSettings } = req.body;

    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: {
        notificationSettings: notificationSettings || undefined,
      }
    });

    res.status(200).json(updatedUser.notificationSettings);
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ message: 'Bildiriş tənzimləmələri yenilənərkən xəta baş verdi' });
  }
};

export const getNotificationSettings = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.sessionClaims?.sub as string;
    if (!clerkId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { 
        notificationSettings: true,
        telegramId: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }

    res.status(200).json({
      ...(user.notificationSettings as any),
      telegramId: user.telegramId
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Bildiriş tənzimləmələri gətirərkən xəta baş verdi' });
  }
};
