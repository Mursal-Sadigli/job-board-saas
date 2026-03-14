import { Router } from 'express';
import { getAllJobs, createJob } from '../controllers/jobController';

const router = Router();

router.get('/', getAllJobs);
router.post('/', createJob);

export default router;
