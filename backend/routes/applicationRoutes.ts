import { Router } from 'express';
import { 
  getApplications, 
  updateApplication, 
  deleteApplication, 
  applyForJob, 
  getApplicationResumeUrl, 
  getCandidates,
  getTalentPool,
  getCandidateById,
  analyzeAndAddToPool
} from '../controllers/applicationController';

import { upload, memoryUpload } from '../lib/cloudinary';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

router.post('/apply', isAuthenticated, memoryUpload.single('resume'), applyForJob);
router.get('/', isAuthenticated, getApplications);
router.get('/candidates', isAuthenticated, getCandidates);
router.get('/candidates/:id', isAuthenticated, getCandidateById);
router.get('/talent-pool', isAuthenticated, getTalentPool);
router.patch('/:id', isAuthenticated, updateApplication);
router.delete('/:id', isAuthenticated, deleteApplication);
router.get('/:id/resume', isAuthenticated, getApplicationResumeUrl);
router.post('/analyze', isAuthenticated, memoryUpload.single('resume'), analyzeAndAddToPool);

export default router;
