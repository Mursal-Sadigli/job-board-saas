import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    const jobs = await prisma.job.findMany({
      where: { 
        isActive: true,
        ...(category && category !== 'any' ? { 
          category: {
            slug: String(category)
          } 
        } : {})
      },
      orderBy: { postedAt: 'desc' },
      include: {
        category: true,
        employer: {
          select: {
            companyName: true,
            logoUrl: true
          }
        }
      }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'İş elanlarını gətirərkən xəta baş verdi', error });
  }
};

export const getJobsByEmployer = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) return res.status(401).json({ message: 'İcazə yoxdur' });

    // Find local user from clerk ID
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });

    const jobs = await prisma.job.findMany({
      where: { employerId: user.id },
      orderBy: { postedAt: 'desc' },
      include: {
        category: true,
        _count: { select: { applications: true } },
        applications: {
          select: {
            id: true,
            stage: true,
            rating: true,
            appliedAt: true,
            resumeUrl: true,
            candidate: { select: { name: true, email: true } }
          },
          orderBy: { appliedAt: 'desc' }
        }
      }
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Elanları gətirərkən xəta baş verdi', error });
  }
};

export const createJob = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) return res.status(401).json({ message: 'İcazə yoxdur' });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });

    const {
      title, description, company, location, locationType,
      jobType, categoryId, category, experienceLevel, salary, city, district, deadline, isFeatured
    } = req.body;

    const logoUrl = req.file ? req.file.path : undefined;

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        company: company || user.companyName || 'Şirkət',
        location: [city, district].filter(Boolean).join(', ') || location || '',
        city: city || '',
        locationType,
        jobType,
        experienceLevel,
        salary,
        logoUrl,
        isFeatured: isFeatured === 'true' || isFeatured === true, // handle string from FormData
        employerId: user.id,
        categoryId: categoryId || undefined
      },
      include: { category: true }
    });

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: 'İş elanı yaradılarkən xəta baş verdi', error });
  }
};

export const updateJob = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) return res.status(401).json({ message: 'İcazə yoxdur' });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });

    const { id } = req.params;
    const {
      title, description, company, location, locationType, jobType,
      categoryId, experienceLevel, salary, isActive, isFeatured, city, district
    } = req.body;

    // Verify ownership
    const existing = await prisma.job.findFirst({ where: { id, employerId: user.id } });
    if (!existing) return res.status(404).json({ message: 'Elan tapılmadı' });

    const logoUrl = req.file ? req.file.path : undefined;

    const updated = await prisma.job.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(company !== undefined && { company }),
        ...(locationType !== undefined && { locationType }),
        ...(jobType !== undefined && { jobType }),
        ...(categoryId !== undefined && { categoryId }),
        ...(experienceLevel !== undefined && { experienceLevel }),
        ...(salary !== undefined && { salary }),
        ...(city !== undefined && { city }),
        ...(isActive !== undefined && (isActive === 'true' || isActive === true ? { isActive: true } : { isActive: false })),
        ...(isFeatured !== undefined && (isFeatured === 'true' || isFeatured === true ? { isFeatured: true } : { isFeatured: false })),
        ...(logoUrl && { logoUrl }),
        ...((city !== undefined || district !== undefined) && {
          location: [city ?? '', district ?? ''].filter(Boolean).join(', ')
        }),
        ...(location !== undefined && !city && !district && { location }),
      },
      include: { category: true }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Elan yenilənərkən xəta baş verdi', error });
  }
};

export const deleteJob = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) return res.status(401).json({ message: 'İcazə yoxdur' });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });

    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.job.findFirst({ where: { id, employerId: user.id } });
    if (!existing) return res.status(404).json({ message: 'Elan tapılmadı' });

    // Delete applications first, then job
    await prisma.application.deleteMany({ where: { jobId: id } });
    await prisma.job.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Elan silinərkən xəta baş verdi', error });
  }
};

export const incrementJobView = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Yalnız bazada varsa yeniləyək
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return res.status(404).json({ message: 'İş elanı tapılmadı' });
    
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        viewsCount: { increment: 1 }
      }
    });
    
    res.json({ viewsCount: updatedJob.viewsCount });
  } catch (error) {
    res.status(500).json({ message: 'Baxış sayı artırılarkən xəta baş verdi', error });
  }
};

export const likeJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Auth tələb etmirik ki, qonaqlar da test edə bilsin. İdealda istifadəçiyə görə məhdudlaşdırıla bilər.
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return res.status(404).json({ message: 'İş elanı tapılmadı' });
    
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        likesCount: { increment: 1 }
      }
    });
    
    res.json({ likesCount: updatedJob.likesCount });
  } catch (error) {
    res.status(500).json({ message: 'Bəyənmə xətası', error });
  }
};
