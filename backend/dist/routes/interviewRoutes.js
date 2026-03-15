"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interviewController_1 = require("../controllers/interviewController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.isAuthenticated); // All interview routes require authentication
router.post('/', interviewController_1.createInterview);
router.get('/', interviewController_1.getInterviews);
router.put('/:id', interviewController_1.updateInterview);
router.delete('/:id', interviewController_1.deleteInterview);
exports.default = router;
