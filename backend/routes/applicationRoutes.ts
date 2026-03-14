import { Router } from 'express';
import { getApplications, updateApplication, deleteApplication, applyForJob } from '../controllers/applicationController';

import { upload } from '../lib/cloudinary';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

router.post('/apply', isAuthenticated, upload.single('resume'), applyForJob);
router.get('/', getApplications);
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
