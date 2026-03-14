import { Router } from 'express';
import { createInterview, getInterviews, deleteInterview, updateInterview } from '../controllers/interviewController';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

router.use(isAuthenticated); // All interview routes require authentication

router.post('/', createInterview);
router.get('/', getInterviews);
router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);

export default router;
