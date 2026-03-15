import prisma from '../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { UserRole } from '@prisma/client';
import { Request, Response } from 'express';

export const syncUser = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.userId || req.auth?.sessionClaims?.sub;
    
    console.log('--- User Sync Started ---');
    console.log('Clerk ID:', clerkId);
    console.log('Session Claims:', JSON.stringify(req.auth?.sessionClaims, null, 2));

    if (!clerkId) {
      console.error('User sync error: No Clerk ID found in request auth.');
      return res.status(401).json({ message: 'Unauthorized - No Clerk ID' });
    }

    // Attempt to get user data from session claims
    // These need to be configured in Clerk Dashboard JWT Template
    const email = req.auth?.sessionClaims?.email;
    const firstName = req.auth?.sessionClaims?.first_name || req.auth?.sessionClaims?.firstName;
    const lastName = req.auth?.sessionClaims?.last_name || req.auth?.sessionClaims?.lastName;
    const name = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null;
    const role = (req.auth?.sessionClaims?.metadata?.role?.toUpperCase() as UserRole) || UserRole.CANDIDATE;

    console.log(`Syncing user details: Email=${email}, Name=${name}, Role=${role}`);

    if (!email) {
      console.warn('Warning: Email is missing from session claims. This might cause Prisma unique constraint issues if not handled.');
    }

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        ...(email && { email }),
        ...(name && { name }),
        ...(role && { role }),
      },
      create: {
        clerkId,
        email: email || `user_${clerkId}@temporary.clerk`, // Fallback to avoid unique constraint error if email is missing temporarily
        name,
        role,
      },
      include: { resumes: true }
    });

    console.log('User sync successful for DB ID:', user.id);

    res.status(200).json({
      ...user,
      resumes: user.resumes
    });
  } catch (error: any) {
    console.error('--- User Sync Detailed Error ---');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    if (error.code === 'P2002') {
      console.error('Identity conflict: Email or ClerkID already exists or is empty leading to conflict.');
      return res.status(409).json({ message: 'İstifadəçi məlumatlarında ziddiyyət yarandı (Email artıq istifadə olunur və ya boşdur)' });
    }
    res.status(500).json({ message: 'İstifadəçi sinxronizasiyası zamanı xəta baş verdi', error: error.message });
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
      skills, experience, education, socialLinks 
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
      select: { notificationSettings: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }

    res.status(200).json(user.notificationSettings);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Bildiriş tənzimləmələri gətirərkən xəta baş verdi' });
  }
};
