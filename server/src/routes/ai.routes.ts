import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { aiConfig } from '../features/ai/config/ai.config';
import { aiEngine } from '../features/ai/services/AIEngine';
import { ApiError } from '@/utils/apiError';

const router = Router();

// Require user authentication for all AI Engine routes
router.use(authenticate);

/**
 * GET /api/ai/health
 * Lightweight status check indicating configuration parameters.
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    provider: aiConfig.getActiveProvider(),
    mockMode: aiConfig.isMockModeEnabled(),
    engineVersion: '1.0.0',
  });
});

/**
 * POST /api/ai/test
 * Sandbox route allowing developers/users to dry-run template parameters.
 */
router.post('/test', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const { provider, template, variables } = req.body;

    if (!template || !template.systemPrompt || !template.userPrompt || !template.variables) {
      throw new ApiError(
        400,
        'Invalid template format. SystemPrompt, userPrompt, and variables array are required.'
      );
    }

    const response = await aiEngine.generate(userId, {
      provider,
      template,
      variables: variables || {},
    });

    res.status(200).json({
      status: 'success',
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
