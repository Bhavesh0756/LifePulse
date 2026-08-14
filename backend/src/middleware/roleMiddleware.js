const { sendError } = require('../utils/apiError');

/**
 * Express Middleware: Require specific Role(s) for RBAC
 * Usage: requireRole('DONOR') or requireRole('HOSPITAL', 'ADMIN')
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required', 'AUTH_REQUIRED');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Forbidden: Access denied. Required role: ${allowedRoles.join(' or ')}`,
        'AUTH_FORBIDDEN'
      );
    }

    next();
  };
};

module.exports = {
  requireRole,
};
