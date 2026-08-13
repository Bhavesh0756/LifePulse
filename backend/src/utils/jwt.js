const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'lifepulse_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a signed JWT for authenticated user
 * Payload contains ONLY non-sensitive identity metadata (userId & role)
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

/**
 * Verify a JWT token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * httpOnly Cookie configuration for token delivery
 */
const COOKIE_NAME = 'lifepulse_token';

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true, // Prevents client-side JS theft (XSS protection)
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };
};

/**
 * Send authentication cookie and return user response
 */
const sendAuthTokenCookie = (res, user, token) => {
  res.cookie(COOKIE_NAME, token, getCookieOptions());
};

/**
 * Clear authentication cookie on logout.
 * NOTE ON STATELESS JWT LOGOUT:
 * In a stateless JWT architecture, clearing the httpOnly cookie and removing frontend state
 * revokes client-side session access.
 */
const clearAuthTokenCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    ...getCookieOptions(),
    maxAge: 0,
  });
};

module.exports = {
  generateToken,
  verifyToken,
  sendAuthTokenCookie,
  clearAuthTokenCookie,
  COOKIE_NAME,
};
