import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing in environment variables!');
} else {
  const maskedUrl = process.env.DATABASE_URL.replace(/:([^@]+)@/, ':****@');
  console.log('Initializing Prisma with URL:', maskedUrl);
}

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for some Neon setups if not using specialized certs
  }
});
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

export default prisma;
