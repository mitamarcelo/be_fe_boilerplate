import { createApp } from '@src/main/app';
import { initializeDatabase } from '@src/main/config/database';
import { env } from '@src/main/config/env';
import { logger } from '@src/main/config/logger';

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();

    const app = createApp();

    app.listen(env.PORT, () => {
      logger.info(`API listening on port ${env.PORT}`);
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown startup error.';
    logger.error(`Startup failed before listen: ${reason}`);
    process.exit(1);
  }
};

void startServer();
