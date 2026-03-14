import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      orderBy: { postedAt: 'desc' },
      include: {
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

export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, company, location, locationType, jobType, experienceLevel, salary, employerId } = req.body;
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        company,
        location,
        locationType,
        jobType,
        experienceLevel,
        salary,
        employerId
      }
    });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: 'İş elanı yaradılarkən xəta baş verdi', error });
  }
};
