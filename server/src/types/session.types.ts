import { Session } from '@prisma/client';

// ─── Input for session creation ───────────────────────────────────────────────

export interface CreateSessionInput {
  userId: string;
  refreshTokenHash: string; // Pre-hashed by AuthService before passing here
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
}

// ─── JWT payload embedded inside the refresh token ────────────────────────────

export interface RefreshTokenPayload {
  sub: string; // userId
  sessionId: string; // Session.id — used to look up the session row on refresh
  iat?: number;
  exp?: number;
}

// ─── JWT payload embedded inside the access token ─────────────────────────────

export interface AccessTokenPayload {
  sub: string; // userId
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// ─── What is attached to req.user by auth.middleware ──────────────────────────

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  subscriptionTier: string;
}

export type SessionWithUser = Session & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};
