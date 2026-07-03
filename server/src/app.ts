import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { env } from './config/env';
import { logger } from './utils/logger';

const app = express();

// Configure helmet for basic security HTTP headers
app.use(helmet());

// Configure CORS to only allow incoming requests from frontend origin
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Standard JSON and URL-encoded body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lightweight structured request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs: duration,
      },
      `[HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// Mount consolidated API routes on /api prefix
app.use('/api', router);

// Catch unhandled route requests (404 Not Found)
app.use((req, res, _next) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// Mount global centralized error handler
app.use(errorMiddleware);

export default app;
