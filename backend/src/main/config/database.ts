import net from 'node:net';
import { env } from '@src/main/config/env';

const DB_CONNECTION_TIMEOUT_MS = 5000;

export const databaseConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  name: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  ssl: env.DB_SSL
} as const;

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Unknown database connectivity error.';
};

export const initializeDatabase = async (): Promise<void> =>
  new Promise((resolve, reject) => {
    const socket = net.createConnection({
      host: databaseConfig.host,
      port: databaseConfig.port
    });

    const timeout = setTimeout(() => {
      socket.destroy();
      reject(
        new Error(
          `Database connectivity check timed out after ${DB_CONNECTION_TIMEOUT_MS}ms.`
        )
      );
    }, DB_CONNECTION_TIMEOUT_MS);

    socket.once('connect', () => {
      clearTimeout(timeout);
      socket.end();
      resolve();
    });

    socket.once('error', (error) => {
      clearTimeout(timeout);
      reject(
        new Error(
          `Unable to reach database at ${databaseConfig.host}:${databaseConfig.port}. ${getErrorMessage(error)}`
        )
      );
    });
  });
