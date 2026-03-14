import { Router } from 'express';
import { uploadUserResume, getUserResumes, deleteUserResume, syncUser } from '../controllers/userController';
import { isAuthenticated } from '../middlewares/auth';
import { memoryUpload } from '../lib/cloudinary';

const router = Router();

router.post('/sync', isAuthenticated, syncUser);
router.post('/resumes', isAuthenticated, memoryUpload.single('resume'), uploadUserResume);
router.get('/resumes', isAuthenticated, getUserResumes);
router.delete('/resumes/:id', isAuthenticated, deleteUserResume);

export default router;
