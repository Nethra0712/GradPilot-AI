import { CreateProfileInput, UpdateProfileInput } from '@/types/profile.types';
import { Profile } from '@prisma/client';

/**
 * ProfileRepository
 *
 * Data-access layer for the Profile model.
 * Profile is a 1:1 extension of User — every user may have at most one profile.
 * Profiles store student-specific academic context used to personalise AI generation.
 */
export class ProfileRepository {
  /**
   * Find a profile by the owning user's ID.
   * Used on the intake questionnaire page and for AI generation context building.
   */
  async findByUserId(_userId: string): Promise<Profile | null> {
    throw new Error('Not implemented');
  }

  /**
   * Create a new profile for a user.
   * Called the first time a user completes the intake questionnaire.
   */
  async create(_data: CreateProfileInput): Promise<Profile> {
    throw new Error('Not implemented');
  }

  /**
   * Update an existing profile.
   * Called when the user edits their intake questionnaire answers.
   */
  async update(_userId: string, _data: UpdateProfileInput): Promise<Profile> {
    throw new Error('Not implemented');
  }

  /**
   * Create-or-update (upsert) a profile.
   * Idempotent operation used when the intake form is submitted multiple times.
   */
  async upsert(_data: CreateProfileInput): Promise<Profile> {
    throw new Error('Not implemented');
  }

  /**
   * Delete a profile by user ID.
   * Called during account deletion cascade.
   */
  async delete(_userId: string): Promise<void> {
    throw new Error('Not implemented');
  }
}

export const profileRepository = new ProfileRepository();
