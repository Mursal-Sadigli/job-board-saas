import express from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { isAdmin } from '../middlewares/auth';
import { getSystemSettings, updateSystemSettings, getAdminStats, getAllUsers } from '../controllers/adminController';

const router = express.Router();
const withAuth = ClerkExpressWithAuth();

// Admin routes
router.get('/settings', withAuth, isAdmin, getSystemSettings);
router.post('/settings', withAuth, isAdmin, updateSystemSettings);
router.get('/stats', withAuth, isAdmin, getAdminStats);
router.get('/users', withAuth, isAdmin, getAllUsers);

export default router;
