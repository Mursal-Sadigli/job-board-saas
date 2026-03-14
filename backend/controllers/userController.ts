import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { UserRole } from '@prisma/client';
import { clerkClient } from '@clerk/clerk-sdk-node';

export const syncUser = async (req: Request, res: Response) => {
  console.log('--- Direct Sync Started ---');
  try {
    const auth = (req as any).auth;
    console.log('Auth details from Clerk:', auth);

    const { userId } = auth;

    if (!userId) {
      console.error('Unauthorized: No userId in request');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Fetching user from Clerk API for ID:', userId);
    let clerkUser;
    try {
      clerkUser = await clerkClient.users.getUser(userId);
    } catch (clerkError: any) {
      console.error('Clerk API Error:', clerkError);
      return res.status(500).json({ error: 'Clerk API lookup failed', details: clerkError.message });
    }
    
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null;
    const metaRole = (clerkUser.publicMetadata?.role as string) || 'CANDIDATE';
    const role = (metaRole.toUpperCase() as UserRole) || UserRole.CANDIDATE;

    console.log(`Syncing user to DB: ClerkID=${userId}, Email=${email}, Role=${role}`);

    if (!email) {
      console.error('User email not found in Clerk for user:', userId);
      return res.status(400).json({ error: 'User email not found in Clerk' });
    }

    const syncedUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email,
        name,
        role,
      },
      create: {
        clerkId: userId,
        email,
        name,
        role,
      },
    });

    console.log('Successfully synced user:', syncedUser.id);
    return res.status(201).json({ success: true, user: syncedUser });

  } catch (error: any) {
    console.error('CRITICAL Error in direct user sync:', error);
    return res.status(500).json({ error: 'Sync failed', details: error.message });
  }
};
