import { SafeUser, UpdateUserInput } from '@/types/user.types';

/**
 * UserService
 *
 * Business logic layer for the User domain.
 * Orchestrates repository calls, validation, and cross-domain side effects.
 * Authentication logic (password hashing, JWT) will NOT be implemented here —
 * that belongs in a dedicated AuthService (Sprint 4).
 *
 * Methods currently stub out and throw "Not implemented".
 */
export class UserService {
  /**
   * Retrieve a user's public profile by their ID.
   * Returns a SafeUser (password stripped) to prevent accidental exposure.
   */
  async getUserById(_id: string): Promise<SafeUser | null> {
    throw new Error('Not implemented');
  }

  /**
   * Update a user's profile fields.
   * Will include validation rules (e.g. name length limits) when implemented.
   */
  async updateUser(_id: string, _data: UpdateUserInput): Promise<SafeUser> {
    throw new Error('Not implemented');
  }

  /**
   * Permanently delete a user account and all related data.
   * This triggers cascade deletes on Profile, Document, AIGeneration, and Subscription.
   * Will require additional cleanup logic (e.g. Stripe customer cancellation).
   */
  async deleteUser(_id: string): Promise<void> {
    throw new Error('Not implemented');
  }
}

export const userService = new UserService();
