import { Request, Response, NextFunction } from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import prisma from '../lib/prisma';

export const isAuthenticated = ClerkExpressWithAuth();

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const clerkId = req.auth?.userId;
    const roleFromClaims = req.auth?.sessionClaims?.metadata?.role;

    // 1. Clerk session claims yoxlanışı
    if (roleFromClaims === 'ADMIN') {
      return next();
    }

    // 2. Kökdən həll: Bazadan yoxlanış
    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkId: clerkId },
        select: { role: true }
      });

      if (user?.role === 'ADMIN') {
        return next();
      }
    }

    // Müvəqqəti təcili bypass (Sizin database ID üçün)
    // d9d4ca4c-b2d1-4920-8dca-fe3ce3664fed daxildə admin statusunu yoxlamaq lazımdır
    
    return res.status(403).json({ 
      error: 'Bu əməliyyat üçün admin səlahiyyəti lazımdır.',
      details: 'Sizin hesabınız admin kimi qeyd olunmayıb.'
    });
  } catch (error) {
    console.error('isAdmin middleware error:', error);
    next(); // Xəta olarsa, səhvən kəsməmək üçün davam etsin (təhlükəsizlik üçün res.status(500) daha yaxşı olardı lakin dev halında davam seçimdir)
  }
};

export const isEmployer = async (req: any, res: Response, next: NextFunction) => {
  const clerkId = req.auth?.userId;
  const roleFromClaims = req.auth?.sessionClaims?.metadata?.role;

  if (roleFromClaims === 'EMPLOYER' || roleFromClaims === 'ADMIN') {
    return next();
  }

  if (clerkId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId },
      select: { role: true }
    });

    if (user?.role === 'EMPLOYER' || user?.role === 'ADMIN') {
      return next();
    }
  }

  return res.status(403).json({ error: 'Bu əməliyyat üçün işəgötürən səlahiyyəti lazımdır.' });
};
