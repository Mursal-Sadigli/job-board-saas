import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getSystemSettings = async (req: Request, res: Response) => {
  console.log('[DEBUG] getSystemSettings called');
  try {
    // Prisma klientində modelin mövcudluğunu yoxlayırıq
    const model = (prisma as any).systemSettings;
    if (!model) {
      throw new Error('Prisma systemSettings model is not defined. Please run npx prisma generate.');
    }

    let settings = await model.findUnique({
      where: { id: 'global' }
    });

    console.log('[DEBUG] Settings found:', settings ? 'YES' : 'NO');

    if (!settings) {
      console.log('[DEBUG] Creating default settings...');
      settings = await model.create({
        data: { id: 'global' }
      });
    }

    res.json(settings);
  } catch (error: any) {
    console.error('[CRITICAL] getSystemSettings error:', error);
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

export const updateSystemSettings = async (req: Request, res: Response) => {
  console.log('[DEBUG] updateSystemSettings called with data:', req.body);
  try {
    const model = (prisma as any).systemSettings;
    const data = req.body;
    const settings = await model.upsert({
      where: { id: 'global' },
      update: data,
      create: { ...data, id: 'global' }
    });
    res.json(settings);
  } catch (error: any) {
    console.error('[CRITICAL] updateSystemSettings error:', error);
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [userCount, employerCount, candidateCount, jobCount, applicationCount] = await Promise.all([
      (prisma as any).user.count(),
      (prisma as any).user.count({ where: { role: 'EMPLOYER' } }),
      (prisma as any).user.count({ where: { role: 'CANDIDATE' } }),
      (prisma as any).job.count(),
      (prisma as any).application.count()
    ]);

    res.json({
      totalUsers: userCount,
      employers: employerCount,
      candidates: candidateCount,
      jobs: jobCount,
      applications: applicationCount
    });
  } catch (error: any) {
    console.error('[CRITICAL] getAdminStats error:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await (prisma as any).user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error: any) {
    console.error('[CRITICAL] getAllUsers error:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
