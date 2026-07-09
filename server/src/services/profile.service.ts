import { profileRepository } from '@/repositories/profile.repository';
import { CreateProfileInput, UpdateProfileInput } from '@/types/profile.types';
import { calculateProfileCompletion, CompletionSummary } from '@/utils/profileCompletion';
import { Profile } from '@prisma/client';

/**
 * ProfileService
 *
 * Business logic layer for the Profile domain.
 * Orchestrates calls between the HTTP routing layers and repositories,
 * calculations (profile completion scoring), and soft deletes.
 */
export class ProfileService {
  /**
   * Get a user's academic profile.
   * Excludes soft-deleted profile rows.
   */
  async getProfile(userId: string): Promise<Profile | null> {
    return profileRepository.findByUserId(userId);
  }

  /**
   * Save the academic profile for a user.
   * Idempotent create-or-update operation.
   */
  async saveProfile(data: CreateProfileInput): Promise<Profile> {
    return profileRepository.upsert(data);
  }

  /**
   * Partially update specific profile fields.
   */
  async updateProfile(userId: string, data: UpdateProfileInput): Promise<Profile> {
    return profileRepository.update(userId, data);
  }

  /**
   * Soft delete a student profile.
   */
  async deleteProfile(userId: string): Promise<Profile> {
    return profileRepository.softDelete(userId);
  }

  /**
   * Calculate completeness percentage and details of a profile.
   */
  getProfileCompletion(profile: Profile | null): CompletionSummary {
    return calculateProfileCompletion(profile);
  }
}

export const profileService = new ProfileService();
