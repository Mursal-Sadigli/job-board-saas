import express, { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/stripeController';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

router.post('/create-checkout-session', isAuthenticated, createCheckoutSession);

// Webhook for Stripe needs raw body. We define it in server.ts but this is the handler.
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
