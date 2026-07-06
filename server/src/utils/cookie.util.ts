import { Response } from 'express';
import { env } from '@/config/env';

/**
 * cookie.util.ts
 *
 * Centralises HTTP-only refresh cookie management.
 * Cookie options are defined once here — never duplicated in controllers.
 *
 * Security options:
 *   httpOnly    — JS cannot read this cookie (XSS protection)
 *   secure      — only sent over HTTPS (disabled in development for localhost)
 *   sameSite    — 'strict' prevents the cookie from being sent cross-site (CSRF protection)
 *   path        — scoped to /api/auth so the cookie is not sent on every request
 *   maxAge      — 30 days in milliseconds (mirrors JWT_REFRESH_EXPIRY)
 */

const REFRESH_COOKIE_NAME = 'refresh_token';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Set the HTTP-only refresh token cookie on the response.
 * Called after a successful login, registration, or token refresh.
 */
export function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: THIRTY_DAYS_MS,
  });
}

/**
 * Clear the refresh token cookie by setting its Max-Age to 0.
 * Called on logout.
 */
export function clearRefreshCookie(res: Response): void {
  res.cookie(REFRESH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: 0,
  });
}

/**
 * Read the refresh token value from the incoming request cookies.
 * Returns undefined if the cookie is absent.
 */
export function getRefreshCookie(cookies: Record<string, string>): string | undefined {
  return cookies[REFRESH_COOKIE_NAME];
}

export { REFRESH_COOKIE_NAME };
