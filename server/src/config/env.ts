import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4080),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),

  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  CORS_ORIGIN: z.string().default('http://localhost:8081'),

  // Cloudflare R2 (optional — falls back to local filesystem in dev)
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().default('kolmena'),

  // Email — Resend (optional, logs to console in dev if not set)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Kolmena <noreply@kolmena.app>'),

  // Push Notifications — Expo Push API (wraps FCM + APNs)
  // No credentials needed for Expo Push — uses Expo's service
  // Set EXPO_ACCESS_TOKEN for production rate limits
  EXPO_ACCESS_TOKEN: z.string().optional(),

  // App URL for email links
  APP_URL: z.string().default('http://localhost:3080'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
