/**
 * Authentication Constants
 * Centralized configuration for auth module
 */

export const AUTH_CONSTANTS = {
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 5,
  OTP_RATE_LIMIT_SECONDS: 30,
  MAX_OTP_ATTEMPTS: 5,
  JWT_EXPIRY: "7d",
  COOKIE_OPTIONS: {
    sameSite: "Strict",
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  },
};

export const AUTH_MESSAGES = {
  // Success
  OTP_SENT: "OTP sent successfully to your email",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  USER_FETCHED: "User fetched successfully",

  // Validation Errors
  EMAIL_REQUIRED: "Email is required",
  VALID_EMAIL_REQUIRED: "Valid email address is required",
  OTP_REQUIRED: "OTP is required",
  OTP_LENGTH_ERROR: "OTP must be exactly 6 digits",
  NAME_REQUIRED: "Name is required",
  ROLE_INVALID: "Role must be either 'admin' or 'employee'",
  AVATAR_INVALID: "Avatar must be a valid URL",

  // Business Logic Errors
  OTP_RATE_LIMITED: "Please wait before requesting another OTP",
  ACCOUNT_DISABLED: "Account is disabled",
  OTP_EXPIRED: "OTP has expired. Please request a new one",
  INVALID_OTP: "Invalid OTP. Please try again",
  OTP_ATTEMPTS_EXCEEDED: "Maximum OTP attempts exceeded. Please request a new OTP",
  USER_NOT_FOUND: "User not found",
  OTP_NOT_SENT: "OTP not found. Please send OTP first",
  TOKEN_MISSING: "Not authorized, token missing",

  // Server Errors
  SEND_OTP_ERROR: "Failed to send OTP. Please try again",
  VERIFY_OTP_ERROR: "Failed to verify OTP. Please try again",
  LOGOUT_ERROR: "Failed to logout. Please try again",
};

export const ROLES = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
};
