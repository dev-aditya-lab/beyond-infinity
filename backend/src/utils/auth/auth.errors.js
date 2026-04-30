/**
 * Custom Auth Error Class
 * Provides consistent error handling across auth module
 */
export class AuthError extends Error {
  constructor(message, statusCode, additionalData = {}) {
    super(message);
    this.statusCode = statusCode;
    this.additionalData = additionalData;
    this.name = "AuthError";
  }
}

/**
 * Error handler for async auth controllers
 * Wraps controller functions to handle errors uniformly
 */
export const authErrorHandler = (fn) => {
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      console.error(`Auth Error: ${error.message}`);

      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
          ...error.additionalData,
        });
      }

      // Handle unexpected errors
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred",
      });
    }
  };
};
