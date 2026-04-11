import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDb, disconnectDb } from './config/db.js';
import { logger } from './utils/logger.js';

async function start() {
  await connectDb(env.mongoUri);

  const app = createApp({
    jwtSecret: env.jwtSecret,
    jwtExpiry: env.jwtExpiry,
    corsOrigin: env.corsOrigin,
  });

  const server = app.listen(env.port, () => {
    logger.info('server_started', { port: env.port, nodeEnv: env.nodeEnv });
  });

  const shutdown = async (signal) => {
    logger.info('shutdown_started', { signal });

    server.close(async (closeErr) => {
      if (closeErr) {
        logger.error('shutdown_server_close_failed', { errorMessage: closeErr.message });
        process.exit(1);
        return;
      }

      try {
        await disconnectDb();
        logger.info('shutdown_complete');
        process.exit(0);
      } catch (dbErr) {
        logger.error('shutdown_db_disconnect_failed', { errorMessage: dbErr.message });
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
}

start().catch((error) => {
  logger.error('server_start_failed', { errorMessage: error.message });
  process.exit(1);
});
