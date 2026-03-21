import { Request, Response, NextFunction } from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

export const isAuthenticated = ClerkExpressWithAuth();

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  const role = req.auth?.sessionClaims?.metadata?.role;
  console.log('[DEBUG AUTH] User auth object:', JSON.stringify(req.auth, null, 2));
  console.log('[DEBUG AUTH] User role found:', role);
  
  if (role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Bu əməliyyat üçün admin səlahiyyəti lazımdır.',
      currentRole: role 
    });
  }
  next();
};

export const isEmployer = (req: any, res: Response, next: NextFunction) => {
  const role = req.auth?.sessionClaims?.metadata?.role;
  if (role !== 'EMPLOYER' && role !== 'ADMIN') {
    return res.status(403).json({ error: 'Bu əməliyyat üçün işəgötürən səlahiyyəti lazımdır.' });
  }
  next();
};
