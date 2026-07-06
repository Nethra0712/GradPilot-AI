import { Router } from 'express';
import { authController } from '@/controllers/auth.controller';
import { authenticate } from '@/middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Strict rate limiter for authentication endpoints to prevent brute-force attacks
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many authentication requests from this IP, please try again after 15 minutes',
  },
});

// Apply rate limiter to all auth routes
router.use(authRateLimiter);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Protected endpoint to fetch current session details
router.get('/me', authenticate, authController.me);

export default router;
