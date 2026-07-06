import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/apiError';

/**
 * Authorization guard middleware.
 * Restricts access to users holding one of the specified roles.
 * Must be mounted AFTER the authenticate middleware.
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const user = req.user;
      if (!user) {
        throw new ApiError(401, 'Authentication required');
      }

      if (!allowedRoles.includes(user.role)) {
        throw new ApiError(403, 'You do not have permission to perform this action');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Reusable ownership-or-role authorization guard.
 * Allows access if:
 *   1. The user owns the resource (resolved by the getResourceUserId helper function)
 *   2. The user holds one of the specified roles (defaults to ADMIN if none provided)
 *
 * Must be mounted AFTER the authenticate middleware.
 */
export function requireOwnershipOrRole(
  getResourceUserId: (req: Request) => string | Promise<string>,
  ...allowedRoles: string[]
) {
  // Default to ADMIN if no roles are explicitly allowed
  const targetRoles = allowedRoles.length > 0 ? allowedRoles : ['ADMIN'];

  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        throw new ApiError(401, 'Authentication required');
      }

      // 1. Grant access if user has one of the bypass roles (e.g. ADMIN)
      if (targetRoles.includes(user.role)) {
        return next();
      }

      // 2. Resolve the owner of the requested resource
      const resourceOwnerId = await getResourceUserId(req);

      // 3. Grant access if the current user is the owner
      if (resourceOwnerId && user.id === resourceOwnerId) {
        return next();
      }

      // 4. Deny access otherwise
      throw new ApiError(403, 'You do not have permission to access this resource');
    } catch (error) {
      next(error);
    }
  };
}
