import { Router } from 'express';
import { getEmployerAnalytics } from '../controllers/analyticsController';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

router.get('/employer', isAuthenticated, getEmployerAnalytics);

export default router;
