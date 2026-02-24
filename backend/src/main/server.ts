import { createApp } from '@src/main/app';
import { env } from '@src/main/config/env';
import { logger } from '@src/main/config/logger';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`API listening on port ${env.PORT}`);
});
