import { env } from './config/env.js';
import { buildApp } from './app.js';
import { logger } from './shared/utils/logger.js';

async function main() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    logger.info(`Server running at http://${env.HOST}:${env.PORT}`);
    if (env.NODE_ENV !== 'production') {
      logger.info(`API docs at http://${env.HOST}:${env.PORT}/docs`);
    }
  } catch (err) {
    logger.fatal(err, 'Failed to start server');
    process.exit(1);
  }
}

main();
