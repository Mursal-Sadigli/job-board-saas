import { Router } from 'express';
import { uploadUserResume, getUserResumes, deleteUserResume, syncUser, getUserProfile, updateUserProfile, getNotificationSettings, updateNotificationSettings } from '../controllers/userController';
import { isAuthenticated } from '../middlewares/auth';
import { memoryUpload } from '../lib/cloudinary';

const router = Router();

router.post('/sync', isAuthenticated, syncUser);
router.post('/resumes', isAuthenticated, memoryUpload.single('resume'), uploadUserResume);
router.get('/resumes', isAuthenticated, getUserResumes);
router.delete('/resumes/:id', isAuthenticated, deleteUserResume);

router.get('/profile', isAuthenticated, getUserProfile);
router.put('/profile', isAuthenticated, updateUserProfile);

router.get('/notifications', isAuthenticated, getNotificationSettings);
router.put('/notifications', isAuthenticated, updateNotificationSettings);

export default router;
