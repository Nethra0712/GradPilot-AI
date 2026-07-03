import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),

  // Database connection settings - fallback for dev environment to ease initial startup
  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://postgres:postgres@localhost:5432/gradpilot?schema=public'),
  DIRECT_URL: z.string().url().optional(),

  // JWT configuration
  JWT_ACCESS_SECRET: z.string().default('super-secret-access-token-key-change-me-in-production'),
  JWT_REFRESH_SECRET: z.string().default('super-secret-refresh-token-key-change-me-in-production'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),

  // AI configuration
  AI_PROVIDER: z.enum(['openai', 'anthropic']).default('openai'),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),

  // Front-end and Third-Party integrations
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment configuration validation failed:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
