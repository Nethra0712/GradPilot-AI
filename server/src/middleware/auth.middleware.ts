import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/token.util';
import { ApiError } from '@/utils/apiError';
import prisma from '@/prisma/client';

/**
 * Express middleware that checks the incoming Authorization header for a valid,
 * non-expired JWT access token.
 *
 * If valid, fetches the latest user details from the database and attaches
 * them to `req.user`. Throws 401 Unauthorized if verification or lookup fails.
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      throw new ApiError(401, 'Access token is invalid or expired');
    }

    // Fetch latest user details from DB to guarantee accurate role/subscription info
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new ApiError(401, 'User associated with this token no longer exists');
    }

    // Attach user payload to request context for downstream handlers
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role.toString(),
      subscriptionTier: user.subscriptionTier.toString(),
    };

    next();
  } catch (error) {
    next(error);
  }
}
