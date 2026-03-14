import { Router } from 'express';
import { syncUser } from '../controllers/userController';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

// This endpoint is called from frontend to sync user data
router.post('/sync', isAuthenticated, syncUser);

export default router;
