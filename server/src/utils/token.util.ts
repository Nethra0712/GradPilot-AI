import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { AccessTokenPayload, RefreshTokenPayload } from '@/types/session.types';

/**
 * token.util.ts
 *
 * Centralises all JWT operations so they are never duplicated across the codebase.
 *
 * Access token  — short-lived (15 min), verifies identity on every API request.
 * Refresh token — long-lived (30 days), used only on the /refresh endpoint.
 *                 The raw token is only ever held client-side (HTTP-only cookie).
 *                 Only a bcrypt hash of it is stored in the Session table.
 */

// ─── Access Token ─────────────────────────────────────────────────────────────

export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'],
    algorithm: 'HS256',
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

// ─── Refresh Token ────────────────────────────────────────────────────────────

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'],
    algorithm: 'HS256',
  });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}
