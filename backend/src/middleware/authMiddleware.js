const { User } = require('../models/User');
const { verifyToken, COOKIE_NAME } = require('../utils/jwt');
const { sendError } = require('../utils/apiError');

/**
 * Express Middleware: Authenticate User
 */
const authenticateUser = async (req, res, next) => {
  try {
    let token = null;

    // 1. Read token from httpOnly cookie
    if (req.cookies && req.cookies[COOKIE_NAME]) {
      token = req.cookies[COOKIE_NAME];
    }
    // 2. Fallback to Authorization Header (Bearer token)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'Authentication required. Please log in.', 'AUTH_REQUIRED');
    }

    // Verify Token
    const decoded = verifyToken(token);
    if (!decoded) {
      return sendError(res, 401, 'Session expired or invalid token. Please log in again.', 'AUTH_TOKEN_INVALID');
    }

    // Fetch active user from database
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user || !user.isActive) {
      return sendError(res, 401, 'User account is inactive or no longer exists.', 'AUTH_USER_NOT_FOUND');
    }

    // Attach authenticated user to request
    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 500, 'Authentication error', 'AUTH_ERROR');
  }
};

module.exports = {
  authenticateUser,
};
