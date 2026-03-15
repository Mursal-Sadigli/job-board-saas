"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripeController_1 = require("../controllers/stripeController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Route to create a Stripe Checkout session
router.post('/create-checkout-session', auth_1.isAuthenticated, stripeController_1.createCheckoutSession);
// Route to verify session (Alternate for webhooks during testing)
router.get('/verify-session', auth_1.isAuthenticated, stripeController_1.verifyCheckoutSession);
exports.default = router;
