import dotenv from 'dotenv';

dotenv.config();

const parsePositiveInteger = (value: string | undefined, key: string): number => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${key} must be a positive integer.`);
  }

  return parsedValue;
};

const parseRequiredString = (value: string | undefined, key: string): string => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(`${key} is required and must be non-empty.`);
  }

  return normalizedValue;
};

const parseOptionalBoolean = (value: string | undefined, key: string): boolean => {
  if (value === undefined) {
    return false;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (['true', '1', 'yes', 'on'].includes(normalizedValue)) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(normalizedValue)) {
    return false;
  }

  throw new Error(`${key} must be one of: true, false, 1, 0, yes, no, on, off.`);
};

const portValue = Number(process.env.PORT ?? 3000);

if (!Number.isFinite(portValue) || portValue <= 0) {
  throw new Error('PORT must be a positive number.');
}

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in production.');
}

const dbHost = parseRequiredString(process.env.DB_HOST, 'DB_HOST');
const dbPort = parsePositiveInteger(process.env.DB_PORT, 'DB_PORT');
const dbName = parseRequiredString(process.env.DB_NAME, 'DB_NAME');
const dbUser = parseRequiredString(process.env.DB_USER, 'DB_USER');
const dbPassword = parseRequiredString(process.env.DB_PASSWORD, 'DB_PASSWORD');
const dbSsl = parseOptionalBoolean(process.env.DB_SSL, 'DB_SSL');

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: portValue,
  JWT_SECRET: process.env.JWT_SECRET ?? 'change-me-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',
  DB_HOST: dbHost,
  DB_PORT: dbPort,
  DB_NAME: dbName,
  DB_USER: dbUser,
  DB_PASSWORD: dbPassword,
  DB_SSL: dbSsl
} as const;
