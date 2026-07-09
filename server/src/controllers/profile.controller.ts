import { Request, Response, NextFunction } from 'express';
import { profileService } from '@/services/profile.service';
import { profileSchema } from '@/validators/profile.validator';
import { ApiError } from '@/utils/apiError';

export class ProfileController {
  /**
   * GET /api/profile
   * Returns current authenticated user's profile and calculated completion stats.
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const profile = await profileService.getProfile(userId);
      const completion = profileService.getProfileCompletion(profile);

      res.status(200).json({
        status: 'success',
        data: {
          profile,
          completion,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/profile
   * Creates a student profile if none exists.
   */
  async createProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      // Check if profile already exists
      const existing = await profileService.getProfile(userId);
      if (existing) {
        throw new ApiError(409, 'Profile already exists. Use PUT to update.');
      }

      const validated = profileSchema.parse(req.body);
      const profile = await profileService.saveProfile({
        userId,
        ...validated,
      });
      const completion = profileService.getProfileCompletion(profile);

      res.status(201).json({
        status: 'success',
        data: {
          profile,
          completion,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/profile
   * Updates an existing profile. Creates it if it doesn't exist (idempotent upsert).
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      const validated = profileSchema.parse(req.body);
      const profile = await profileService.saveProfile({
        userId,
        ...validated,
      });
      const completion = profileService.getProfileCompletion(profile);

      res.status(200).json({
        status: 'success',
        data: {
          profile,
          completion,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/profile
   * Performs a soft delete of the student profile.
   */
  async deleteProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }

      // Check if profile exists
      const profile = await profileService.getProfile(userId);
      if (!profile) {
        throw new ApiError(404, 'Profile not found');
      }

      await profileService.deleteProfile(userId);

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

export const profileController = new ProfileController();
