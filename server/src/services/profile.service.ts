import { CreateProfileInput, UpdateProfileInput } from '@/types/profile.types';
import { Profile } from '@prisma/client';

/**
 * ProfileService
 *
 * Business logic layer for the Profile domain.
 * Handles intake questionnaire submissions and profile data retrieval.
 * Profiles drive the personalisation context fed into AI generation prompts.
 */
export class ProfileService {
  /**
   * Get a user's academic profile.
   * Returns null if the intake questionnaire has never been completed.
   */
  async getProfile(_userId: string): Promise<Profile | null> {
    throw new Error('Not implemented');
  }

  /**
   * Save the intake questionnaire for a user.
   * Creates the profile if it does not exist; updates it if it does.
   * This is an idempotent operation — re-submitting the form is safe.
   */
  async saveProfile(_data: CreateProfileInput): Promise<Profile> {
    throw new Error('Not implemented');
  }

  /**
   * Partially update specific profile fields.
   * Used when the user edits individual sections without re-submitting the full form.
   */
  async updateProfile(_userId: string, _data: UpdateProfileInput): Promise<Profile> {
    throw new Error('Not implemented');
  }
}

export const profileService = new ProfileService();
