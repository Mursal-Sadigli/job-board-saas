import { Request, Response, NextFunction } from 'express';
import { ClerkExpressWithAuth, clerkClient } from '@clerk/clerk-sdk-node';
import prisma from '../lib/prisma';

export const isAuthenticated = ClerkExpressWithAuth();

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const roleFromClaims = req.auth?.sessionClaims?.metadata?.role;
    const userEmail = req.auth?.sessionClaims?.email;
    let userId = req.auth?.userId;

    // 1. Clerk Claims yoxlanışı (Ən sürətli yol)
    if (roleFromClaims === 'ADMIN' || userEmail === 'msadigli2025@gmail.com') {
      return next();
    }

    // 2. Kökdən həll: Əgər Clerk middleware req.auth-u doldura bilməyibsə
    const authHeader = req.headers.authorization;
    if (!userId && authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        console.log('[DEBUG] Manual token verification started...');
        // Token-i əl ilə yoxlayırıq
        const decoded = await clerkClient.verifyToken(token);
        userId = decoded.sub;
        console.log('[DEBUG] Manual verification success. User ID:', userId);
      } catch (err) {
        console.error('[DEBUG] Manual verification failed:', err);
      }
    }

    // 3. Bazadan yoxlanış (ID varsa)
    if (userId) {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { role: true, email: true }
      });

      console.log(`[DEBUG] DB User: e=${dbUser?.email}, r=${dbUser?.role}`);

      if (dbUser?.role === 'ADMIN' || dbUser?.email === 'msadigli2025@gmail.com') {
        return next();
      }
    }

    // 4. Son cəhd: Heç nə alınmadısa re-sync ehtimalı və ya səlahiyyət yoxdur
    return res.status(403).json({ 
      error: 'Bu əməliyyat üçün admin səlahiyyəti lazımdır.',
      authStatus: {
        hasToken: !!authHeader,
        identified: !!userId
      }
    });
  } catch (error) {
    console.error('CRITICAL: isAdmin error:', error);
    return res.status(500).json({ error: 'Server xətası' });
  }
};

export const isEmployer = async (req: any, res: Response, next: NextFunction) => {
  // Bura da bənzər bir fallback əlavə oluna bilər lakin əsas fokus admindir
  const role = req.auth?.sessionClaims?.metadata?.role;
  if (role === 'EMPLOYER' || role === 'ADMIN') {
    return next();
  }
  return res.status(403).json({ error: 'Bu əməliyyat üçün işəgötürən səlahiyyəti lazımdır.' });
};
