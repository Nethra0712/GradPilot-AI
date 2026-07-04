import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

/**
 * Express error-handling middleware that catches all unhandled or explicit errors
 * throughout the request lifecycle and formats a consistent JSON error response.
 */
export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response {
  if (err instanceof ApiError) {
    logger.warn(
      `Operational Error [${req.method} ${req.path}]: ${err.statusCode} - ${err.message}`
    );
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors,
    });
  }

  // Handle Zod validation errors directly
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err,
    });
  }

  // Catch-all for unhandled system exceptions (log stack trace, hide in production)
  logger.error(err, `System Error [${req.method} ${req.path}]`);

  const responseBody = {
    status: 'error',
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  };

  return res.status(500).json(responseBody);
}

export default errorMiddleware;
