import express, { Router } from 'express';
import { handleClerkWebhook } from '../controllers/webhookController';
import { handleWebhook as handleStripeWebhook } from '../controllers/stripeController';

const router = Router();

// Clerk webhooks need the raw body for signature verification
router.post('/clerk', express.raw({ type: 'application/json' }), handleClerkWebhook);

// Stripe webhooks also need the raw body
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
