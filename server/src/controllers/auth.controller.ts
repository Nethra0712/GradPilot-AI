import { Request, Response, NextFunction } from 'express';
import { authService } from '@/services/auth.service';
import { setRefreshCookie, clearRefreshCookie, getRefreshCookie } from '@/utils/cookie.util';
import { ApiError } from '@/utils/apiError';

export class AuthController {
  /**
   * Handler for user registration.
   * POST /api/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;

      const { accessToken, refreshToken, user } = await authService.register(req.body, {
        userAgent,
        ipAddress,
      });

      setRefreshCookie(res, refreshToken);

      res.status(201).json({
        status: 'success',
        data: {
          accessToken,
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handler for user login.
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;

      const { accessToken, refreshToken, user } = await authService.login(req.body, {
        userAgent,
        ipAddress,
      });

      setRefreshCookie(res, refreshToken);

      res.status(200).json({
        status: 'success',
        data: {
          accessToken,
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handler for rotating access and refresh tokens.
   * POST /api/auth/refresh
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = getRefreshCookie(req.cookies || {});
      if (!token) {
        throw new ApiError(401, 'No refresh token provided');
      }

      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;

      const { accessToken, refreshToken } = await authService.refresh(token, {
        userAgent,
        ipAddress,
      });

      setRefreshCookie(res, refreshToken);

      res.status(200).json({
        status: 'success',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      // If refresh fails, clear the invalid cookie to reset the client state
      clearRefreshCookie(res);
      next(error);
    }
  }

  /**
   * Handler for user logout.
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = getRefreshCookie(req.cookies || {});
      if (token) {
        await authService.logout(token);
      }

      clearRefreshCookie(res);

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handler to get current logged-in user profile.
   * GET /api/auth/me (Protected)
   */
  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        throw new ApiError(401, 'Not authenticated');
      }

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            subscriptionPlan: user.subscriptionTier,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
