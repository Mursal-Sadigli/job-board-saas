import { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/stripeController';
import { isAuthenticated } from '../middlewares/auth';
import express from 'express';

const router = Router();

// Route to create a Stripe Checkout session
router.post('/create-checkout-session', isAuthenticated, createCheckoutSession);

// Stripe Webhook (Requires raw body)
// IMPORTANT: Webhook handler handles the raw body separately in server.ts
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
