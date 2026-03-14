"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmployer = exports.isAdmin = exports.isAuthenticated = void 0;
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
exports.isAuthenticated = (0, clerk_sdk_node_1.ClerkExpressWithAuth)();
const isAdmin = (req, res, next) => {
    const role = req.auth?.sessionClaims?.metadata?.role;
    if (role !== 'ADMIN') {
        return res.status(403).json({ error: 'Bu əməliyyat üçün admin səlahiyyəti lazımdır.' });
    }
    next();
};
exports.isAdmin = isAdmin;
const isEmployer = (req, res, next) => {
    const role = req.auth?.sessionClaims?.metadata?.role;
    if (role !== 'EMPLOYER' && role !== 'ADMIN') {
        return res.status(403).json({ error: 'Bu əməliyyat üçün işəgötürən səlahiyyəti lazımdır.' });
    }
    next();
};
exports.isEmployer = isEmployer;
