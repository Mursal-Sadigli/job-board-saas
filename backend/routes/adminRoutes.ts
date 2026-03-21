import express from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth';
import { getSystemSettings, updateSystemSettings, getAdminStats, getAllUsers } from '../controllers/adminController';

const router = express.Router();

// Admin routes
router.get('/settings', isAuthenticated, isAdmin, getSystemSettings);
router.post('/settings', isAuthenticated, isAdmin, updateSystemSettings);
router.get('/stats', isAuthenticated, isAdmin, getAdminStats);
router.get('/users', isAuthenticated, isAdmin, getAllUsers);

export default router;
