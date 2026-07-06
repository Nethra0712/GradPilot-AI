import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { env } from '@/config/env';
import prisma from '@/prisma/client';
import { ApiError } from '@/utils/apiError';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/token.util';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { SafeUser } from '@/types/user.types';
import { loginSchema, registerSchema } from '@/validators/auth.validator';

interface AuthContext {
  userAgent?: string;
  ipAddress?: string;
}

interface AuthResponse {
  accessToken: string;
  user: SafeUser;
}

export class AuthService {
  /**
   * Registers a new user.
   * Creates the user record and their default free subscription in a single transaction.
   * Then creates a session, issues access/refresh tokens, and returns them.
   */
  async register(
    input: unknown,
    context: AuthContext
  ): Promise<AuthResponse & { refreshToken: string }> {
    const validated = registerSchema.parse(input);

    // 1. Verify email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });
    if (existingUser) {
      throw new ApiError(409, 'A user with this email address already exists');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(validated.password, env.BCRYPT_SALT_ROUNDS);

    // 3. Create User + Subscription in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: validated.email,
          fullName: validated.fullName,
          password: hashedPassword,
          subscriptionTier: SubscriptionPlan.FREE,
          subscription: {
            create: {
              plan: SubscriptionPlan.FREE,
              status: SubscriptionStatus.ACTIVE,
            },
          },
        },
      });
      return newUser;
    });

    // 4. Create session and generate tokens
    const { accessToken, refreshToken } = await this.createSessionAndTokens(
      user.id,
      user.email,
      user.role.toString(),
      context
    );

    // Remove password before returning user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  /**
   * Logs in a user by validating their email and password.
   * Creates a new session, issues access/refresh tokens.
   */
  async login(
    input: unknown,
    context: AuthContext
  ): Promise<AuthResponse & { refreshToken: string }> {
    const validated = loginSchema.parse(input);

    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });
    // Generic error message for security
    if (!user || !user.password) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 2. Compare password
    const isPasswordMatch = await bcrypt.compare(validated.password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 3. Create session and generate tokens
    const { accessToken, refreshToken } = await this.createSessionAndTokens(
      user.id,
      user.email,
      user.role.toString(),
      context
    );

    // Remove password before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  /**
   * Refreshes the access token using a valid, non-expired refresh token.
   * Implements token rotation and reuse detection.
   */
  async refresh(
    token: string,
    context: AuthContext
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!token) {
      throw new ApiError(401, 'Refresh token is required');
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    // 1. Fetch Session from DB
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (!session) {
      throw new ApiError(401, 'Session not found');
    }

    // 2. Check hard expiry
    if (session.expiresAt < new Date()) {
      throw new ApiError(401, 'Session has expired');
    }

    // 3. Token Reuse Detection
    // If the session was already revoked, someone is trying to reuse a compromised token
    if (session.revokedAt) {
      // Security measure: revoke all other active sessions for this user
      await prisma.session.updateMany({
        where: { userId: session.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new ApiError(401, 'Session has been revoked');
    }

    // Compare raw refresh token with the stored bcrypt hash
    const isMatch = await bcrypt.compare(token, session.refreshTokenHash);
    if (!isMatch) {
      // If hashes do not match, this is a rotated token reuse!
      // Revoke the session immediately to lock down access.
      await prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
      // Revoke all other active sessions for this user too
      await prisma.session.updateMany({
        where: { userId: session.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new ApiError(401, 'Invalid refresh token signature');
    }

    // 4. Generate new tokens (Rotation)
    const newSessionId = crypto.randomUUID();
    const newRefreshToken = generateRefreshToken({ sub: session.userId, sessionId: newSessionId });
    const newAccessToken = generateAccessToken({
      sub: session.userId,
      email: session.user.email,
      role: session.user.role.toString(),
    });

    const newHash = await bcrypt.hash(newRefreshToken, env.BCRYPT_SALT_ROUNDS);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    // 5. Invalidate old session and create a new one to complete the rotation
    await prisma.$transaction([
      prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      }),
      prisma.session.create({
        data: {
          id: newSessionId,
          userId: session.userId,
          refreshTokenHash: newHash,
          userAgent: context.userAgent,
          ipAddress: context.ipAddress,
          expiresAt,
        },
      }),
    ]);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Revokes the active session.
   */
  async logout(token: string): Promise<void> {
    if (!token) return;

    try {
      const payload = verifyRefreshToken(token);
      await prisma.session.update({
        where: { id: payload.sessionId },
        data: { revokedAt: new Date() },
      });
    } catch {
      // Fail silently for robustness (e.g. token expired anyway)
    }
  }

  /**
   * Helper to create a new session record and return access/refresh tokens.
   */
  private async createSessionAndTokens(
    userId: string,
    email: string,
    role: string,
    context: AuthContext
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const sessionId = crypto.randomUUID();

    const accessToken = generateAccessToken({ sub: userId, email, role });
    const refreshToken = generateRefreshToken({ sub: userId, sessionId });

    // Hash refresh token
    const hash = await bcrypt.hash(refreshToken, env.BCRYPT_SALT_ROUNDS);

    // Expiry date (30 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Save session
    await prisma.session.create({
      data: {
        id: sessionId,
        userId,
        refreshTokenHash: hash,
        userAgent: context.userAgent,
        ipAddress: context.ipAddress,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
