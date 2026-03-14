"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// This endpoint is called from frontend to sync user data
router.post('/sync', auth_1.isAuthenticated, userController_1.syncUser);
exports.default = router;
