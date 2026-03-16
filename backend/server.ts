import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

import webhookRoutes from './routes/webhookRoutes';
import stripeRoutes from './routes/stripeRoutes';

const app = express();
const PORT = process.env.PORT || 5001;

// Trust Proxy for Render/Cloudflare/etc.
app.set('trust proxy', 1);

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://nextgen-jobboard.vercel.app', // Eski host
    'https://job-board-saas.vercel.app', // YENİ VERCEL HOST
    'http://localhost:3000'
  ],
  credentials: true
}));

// Webhooks (Must be before express.json() for raw body processing)
app.use('/api/webhooks', webhookRoutes);

app.use(express.json());

// Main App Routes
app.use('/api/stripe', stripeRoutes);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Həddindən artıq sorğu göndərildi, lütfən bir qədər sonra yenidən cəhd edin.'
});
app.use('/api/', limiter);

import jobRoutes from './routes/jobRoutes';
import applicationRoutes from './routes/applicationRoutes';
import userRoutes from './routes/userRoutes';
import interviewRoutes from './routes/interviewRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import aiRoutes from './routes/aiRoutes';
import { inngest, helloWorld } from './lib/inngest';
import { serve } from 'inngest/express';

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Job Board Backend' 
  });
});

// Inngest
app.use("/api/inngest", serve({ client: inngest, functions: [helloWorld] }));
// Routes Registration
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/inngest', serve({ client: inngest, functions: [helloWorld] }));

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
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
