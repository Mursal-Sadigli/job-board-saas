import prisma from '../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { UserRole } from '@prisma/client';
import { Request, Response } from 'express';

export const syncUser = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.userId || req.auth?.sessionClaims?.sub;
    
    if (!clerkId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attempt to get user data from session claims
    // These need to be configured in Clerk Dashboard JWT Template
    const email = req.auth?.sessionClaims?.email;
    const firstName = req.auth?.sessionClaims?.first_name;
    const lastName = req.auth?.sessionClaims?.last_name;
    const name = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null;
    const role = (req.auth?.sessionClaims?.metadata?.role?.toUpperCase() as UserRole) || UserRole.CANDIDATE;

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        ...(email && { email }),
        ...(name && { name }),
        ...(role && { role }),
      },
      create: {
        clerkId,
        email: email || '', // Webhook should eventually fill this if JWT doesn't have it
        name,
        role,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('User sync error:', error);
    res.status(500).json({ message: 'İstifadəçi sinxronizasiyası zamanı xəta baş verdi' });
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
      resource_type: 'raw',
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

    res.status(200).json(user.resumes);
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
    // Extract public_id from URL
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
