"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const webhookRoutes_1 = __importDefault(require("./routes/webhookRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:51212'
    ],
    credentials: true
}));
// Webhooks (Must be before express.json() for raw body processing)
app.use('/api/webhooks', webhookRoutes_1.default);
app.use(express_1.default.json());
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Həddindən artıq sorğu göndərildi, lütfən bir qədər sonra yenidən cəhd edin.'
});
app.use('/api/', limiter);
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const inngest_1 = require("./lib/inngest");
const express_2 = require("inngest/express");
// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Job Board Backend'
    });
});
// Inngest
app.use("/api/inngest", (0, express_2.serve)({ client: inngest_1.inngest, functions: [inngest_1.helloWorld] }));
// Routes Registration
app.use('/api/jobs', jobRoutes_1.default);
app.use('/api/applications', applicationRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('--- Global Error Caught ---');
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
    console.error('Error Object:', JSON.stringify(err, null, 2));
    res.status(err.status || 500).json({
        error: 'Server xətası',
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err : undefined
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} ünvanında işləyir`);
});
