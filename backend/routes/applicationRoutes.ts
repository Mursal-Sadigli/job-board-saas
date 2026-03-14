import { Router } from 'express';
import { getApplications, updateApplication, deleteApplication, applyForJob, getApplicationResumeUrl } from '../controllers/applicationController';

import { upload, memoryUpload } from '../lib/cloudinary';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

router.post('/apply', isAuthenticated, memoryUpload.single('resume'), applyForJob);
router.get('/', getApplications);
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.get('/:id/resume', isAuthenticated, getApplicationResumeUrl);

export default router;
