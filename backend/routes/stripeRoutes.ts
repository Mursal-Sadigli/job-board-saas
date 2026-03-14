import { Router } from 'express';
import { createCheckoutSession, handleWebhook, verifyCheckoutSession } from '../controllers/stripeController';
import { isAuthenticated } from '../middlewares/auth';
import express from 'express';

const router = Router();

// Route to create a Stripe Checkout session
router.post('/create-checkout-session', isAuthenticated, createCheckoutSession);

// Route to verify session (Alternate for webhooks during testing)
router.get('/verify-session', isAuthenticated, verifyCheckoutSession);

export default router;
