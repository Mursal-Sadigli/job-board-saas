import { Router } from 'express';
import { getAllJobs, createJob, getJobsByEmployer, updateJob, deleteJob } from '../controllers/jobController';
import { isAuthenticated } from '../middlewares/auth';
import { upload } from '../lib/cloudinary';

const router = Router();

router.get('/', getAllJobs);
router.get('/my', isAuthenticated, getJobsByEmployer);
router.post('/', isAuthenticated, upload.single('logo'), createJob);
router.patch('/:id', isAuthenticated, upload.single('logo'), updateJob);
router.delete('/:id', isAuthenticated, deleteJob);

export default router;
