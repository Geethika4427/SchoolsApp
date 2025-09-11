import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token';

export function signToken(payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// helper to set cookie header (server-side)
export function serializeTokenCookie(token, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const cookie = `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax; Secure=${process.env.VERCEL_ENV === 'production' ? 'Secure;' : ''}`;
  return cookie;
}
