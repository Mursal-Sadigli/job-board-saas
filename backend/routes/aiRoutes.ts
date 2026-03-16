import express from 'express';
import { generateAIUserCV } from '../controllers/aiController';

const router = express.Router();

// CV Generation route
router.post('/generate-cv', generateAIUserCV);

export default router;
