import { CreateUserInput, SafeUser, UpdateUserInput } from '@/types/user.types';

/**
 * UserRepository
 *
 * Data-access layer for the User model.
 * All database queries for User records go through this class.
 * No business logic lives here — only raw Prisma interactions.
 *
 * Methods currently return placeholder values.
 * Business logic implementation will be added in Sprint 4.
 */
export class UserRepository {
  /**
   * Find a user by their unique ID.
   * Used for authenticated request resolution and profile lookups.
   */
  async findById(_id: string): Promise<SafeUser | null> {
    throw new Error('Not implemented');
  }

  /**
   * Find a user by email address.
   * Used during authentication and registration duplicate checks.
   */
  async findByEmail(_email: string): Promise<SafeUser | null> {
    throw new Error('Not implemented');
  }

  /**
   * Create a new user record.
   * Called during registration flow.
   */
  async create(_data: CreateUserInput): Promise<SafeUser> {
    throw new Error('Not implemented');
  }

  /**
   * Update a user's mutable fields.
   * Called when profile name, role, or subscription tier is changed.
   */
  async update(_id: string, _data: UpdateUserInput): Promise<SafeUser> {
    throw new Error('Not implemented');
  }

  /**
   * Permanently delete a user and cascade all related records.
   * This is a hard delete — all associated documents, generations, and subscriptions are removed.
   */
  async delete(_id: string): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * Check whether a user with a given email exists.
   * Used during registration validation.
   */
  async existsByEmail(_email: string): Promise<boolean> {
    throw new Error('Not implemented');
  }
}

// Singleton export — one repository instance per process
export const userRepository = new UserRepository();
