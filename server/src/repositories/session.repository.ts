import { Session } from '@prisma/client';
import prisma from '@/prisma/client';
import { CreateSessionInput } from '@/types/session.types';

/**
 * SessionRepository
 *
 * Data-access layer for the Session model.
 * Sessions are append-heavy: one row per login, never updated except to:
 *   1. Set revokedAt on logout or token reuse detection
 *   2. Update refreshTokenHash on token rotation
 *
 * A single user can have many concurrent sessions (multiple devices/browsers).
 */
export class SessionRepository {
  /**
   * Find a session by its primary key.
   * Called on every token refresh to validate the session still exists.
   */
  async findById(id: string): Promise<Session | null> {
    return prisma.session.findUnique({ where: { id } });
  }

  /**
   * Create a new session row.
   * Called immediately after a successful login or registration.
   * The refreshTokenHash must already be bcrypt-hashed by the caller.
   */
  async create(data: CreateSessionInput): Promise<Session> {
    return prisma.session.create({ data });
  }

  /**
   * Revoke a specific session by setting revokedAt to now.
   * Called on logout and on refresh-token reuse detection.
   */
  async revoke(id: string): Promise<Session> {
    return prisma.session.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Rotate the refresh token hash in an existing session.
   * Called on every successful token refresh to invalidate the old token.
   */
  async rotateToken(id: string, newRefreshTokenHash: string): Promise<Session> {
    return prisma.session.update({
      where: { id },
      data: { refreshTokenHash: newRefreshTokenHash },
    });
  }

  /**
   * Revoke ALL active sessions for a user.
   * Called on refresh-token reuse detection as a security countermeasure —
   * if one token is replayed, we assume all sessions are potentially compromised.
   */
  async revokeAllForUser(userId: string): Promise<void> {
    await prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * List all non-expired, non-revoked sessions for a user.
   * Used for the "active sessions" management view (future sprint).
   */
  async findActiveByUserId(userId: string): Promise<Session[]> {
    return prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const sessionRepository = new SessionRepository();
