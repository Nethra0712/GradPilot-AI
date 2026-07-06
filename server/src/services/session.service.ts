import { Session } from '@prisma/client';
import { sessionRepository } from '@/repositories/session.repository';
import { CreateSessionInput } from '@/types/session.types';

/**
 * SessionService
 *
 * Business logic layer for the Session domain.
 * Delegates all database access to SessionRepository.
 * The AuthService is the primary consumer of this service.
 */
export class SessionService {
  /**
   * Create a new session for a user.
   * The refreshTokenHash must be bcrypt-hashed before calling this.
   */
  async createSession(data: CreateSessionInput): Promise<Session> {
    return sessionRepository.create(data);
  }

  /**
   * Find a session by ID for validation during the refresh flow.
   */
  async findSessionById(id: string): Promise<Session | null> {
    return sessionRepository.findById(id);
  }

  /**
   * Revoke a session on logout.
   */
  async revokeSession(id: string): Promise<Session> {
    return sessionRepository.revoke(id);
  }

  /**
   * Rotate the refresh token hash after a successful refresh.
   */
  async rotateSessionToken(id: string, newHash: string): Promise<Session> {
    return sessionRepository.rotateToken(id, newHash);
  }

  /**
   * Revoke all sessions for a user — used when token reuse is detected.
   */
  async revokeAllUserSessions(userId: string): Promise<void> {
    return sessionRepository.revokeAllForUser(userId);
  }

  /**
   * Get all active sessions for a user.
   * Used for the device management view in future sprints.
   */
  async getActiveSessions(userId: string): Promise<Session[]> {
    return sessionRepository.findActiveByUserId(userId);
  }
}

export const sessionService = new SessionService();
