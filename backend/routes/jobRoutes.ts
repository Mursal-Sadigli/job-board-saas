import { Router } from 'express';
import { getAllJobs, createJob, getJobsByEmployer, updateJob, deleteJob } from '../controllers/jobController';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

router.get('/', getAllJobs);
router.get('/my', isAuthenticated, getJobsByEmployer);
router.post('/', isAuthenticated, createJob);
router.patch('/:id', isAuthenticated, updateJob);
router.delete('/:id', isAuthenticated, deleteJob);

export default router;
