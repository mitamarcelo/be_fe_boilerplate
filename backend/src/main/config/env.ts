import dotenv from 'dotenv';

dotenv.config();

const portValue = Number(process.env.PORT ?? 3000);

if (!Number.isFinite(portValue) || portValue <= 0) {
  throw new Error('PORT must be a positive number.');
}

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in production.');
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: portValue,
  JWT_SECRET: process.env.JWT_SECRET ?? 'change-me-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h'
} as const;
