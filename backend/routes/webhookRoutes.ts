import express, { Router } from 'express';
import { handleClerkWebhook } from '../controllers/webhookController';

const router = Router();

// Clerk webhooks need the raw body for signature verification
router.post('/clerk', express.raw({ type: 'application/json' }), handleClerkWebhook);

export default router;
