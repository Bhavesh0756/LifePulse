class ApiError extends Error {
  constructor(statusCode, message, code = 'INTERNAL_ERROR', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

const sendError = (res, statusCode, message, code = 'ERROR', errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    code,
    errors,
  });
};

const sendSuccess = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

module.exports = {
  ApiError,
  sendError,
  sendSuccess,
};
