import { Router } from 'express';
import prisma from '../prisma/client';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/health
 *
 * Verifies that the backend service is running and the database connection is healthy.
 *
 * Performs a lightweight `SELECT 1` query against the Neon PostgreSQL database.
 * This is intentionally cheap — it wakes the connection pool without scanning any table.
 *
 * Response shape:
 *   200 OK  → { status: "ok",    database: "healthy",   timestamp: "<ISO8601>" }
 *   503     → { status: "error", database: "unhealthy", timestamp: "<ISO8601>" }
 */
router.get('/health', async (_req, res) => {
  const timestamp = new Date().toISOString();

  try {
    // Minimal query that verifies the Prisma Client can communicate with Postgres.
    // Does not read from any application table — safe to call at high frequency.
    await prisma.$queryRaw`SELECT 1`;

    logger.info('Database health check passed');

    res.status(200).json({
      status: 'ok',
      database: 'healthy',
      timestamp,
    });
  } catch (error) {
    logger.error({ err: error }, 'Database health check failed');

    res.status(503).json({
      status: 'error',
      database: 'unhealthy',
      timestamp,
    });
  }
});

export default router;
