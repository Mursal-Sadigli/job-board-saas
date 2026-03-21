import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Hər kəs üçün açıq olan sistem tənzimləmələri
router.get('/settings', async (req: Request, res: Response) => {
  try {
    const settings = await (prisma as any).systemSettings.findUnique({
      where: { id: 'global' },
      select: {
        maintenanceMode: true,
        candidateRegistration: true,
        aiAnalysesEnabled: true
      }
    });

    res.json(settings || { maintenanceMode: false });
  } catch (error) {
    console.error('Public settings error:', error);
    res.status(500).json({ maintenanceMode: false });
  }
});

export default router;
