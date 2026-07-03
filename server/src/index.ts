import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { disconnectPrisma } from './prisma/client';

// Start Express HTTP Server
const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

/**
 * Handles graceful process shutdown signals (like SIGINT, SIGTERM)
 * to close database connections and stop HTTP server connections cleanly.
 */
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed.');

    // Gracefully release Prisma Client connections
    await disconnectPrisma();

    logger.info('Graceful shutdown finished. Exiting.');
    process.exit(0);
  });

  // Fallback timeout to force-exit if connections remain hanging
  setTimeout(() => {
    logger.error('Graceful shutdown timeout exceeded. Forcing exit.');
    process.exit(1);
  }, 10000);
}

// Bind process event handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason);
  // Optional: trigger graceful shutdown on unhandled rejections
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});
