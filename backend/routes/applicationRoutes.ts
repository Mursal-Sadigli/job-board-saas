import { Router } from 'express';
import { 
  getApplications, 
  updateApplication, 
  deleteApplication, 
  applyForJob, 
  getApplicationResumeUrl, 
  getCandidates 
} from '../controllers/applicationController';

import { upload, memoryUpload } from '../lib/cloudinary';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

router.post('/apply', isAuthenticated, memoryUpload.single('resume'), applyForJob);
router.get('/', isAuthenticated, getApplications);
router.get('/candidates', isAuthenticated, getCandidates);
router.patch('/:id', isAuthenticated, updateApplication);
router.delete('/:id', isAuthenticated, deleteApplication);
router.get('/:id/resume', isAuthenticated, getApplicationResumeUrl);

export default router;
