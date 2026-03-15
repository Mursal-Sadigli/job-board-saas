"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = require("../controllers/analyticsController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/employer', auth_1.isAuthenticated, analyticsController_1.getEmployerAnalytics);
exports.default = router;
