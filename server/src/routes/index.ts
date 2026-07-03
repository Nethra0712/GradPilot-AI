import { Router } from 'express';

const router = Router();

/**
 * Health check endpoint to verify backend service status.
 * GET /api/health
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;
