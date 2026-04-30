import { body, validationResult } from "express-validator";
import { AUTH_MESSAGES, ROLES } from "../constants/auth.constants.js";

/**
 * Express validator middleware - handles validation errors
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: errors.array(),
  });
}

/**
 * Validate Send OTP endpoint
 * Required: email
 * Optional: name, role, avatar
 */
export const validateSendOTP = [
  body("email").trim().isEmail().withMessage(AUTH_MESSAGES.VALID_EMAIL_REQUIRED).normalizeEmail(),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(AUTH_MESSAGES.NAME_REQUIRED)
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("role")
    .optional()
    .isIn([ROLES.ADMIN, ROLES.EMPLOYEE])
    .withMessage(AUTH_MESSAGES.ROLE_INVALID),

  body("avatar").optional().trim().isURL().withMessage(AUTH_MESSAGES.AVATAR_INVALID),

  validate,
];

/**
 * Validate Verify OTP endpoint
 * Required: email, otp
 */
export const validateVerifyOTP = [
  body("email").trim().isEmail().withMessage(AUTH_MESSAGES.VALID_EMAIL_REQUIRED).normalizeEmail(),

  body("otp")
    .trim()
    .notEmpty()
    .withMessage(AUTH_MESSAGES.OTP_REQUIRED)
    .isLength({ min: 6, max: 6 })
    .withMessage(AUTH_MESSAGES.OTP_LENGTH_ERROR)
    .isNumeric()
    .withMessage("OTP must contain only numbers"),

  validate,
];

/**
 * Validate Register endpoint (if separate registration needed)
 * Required: email, name
 * Optional: role, avatar
 */
export const validateRegister = [
  body("email").trim().isEmail().withMessage(AUTH_MESSAGES.VALID_EMAIL_REQUIRED).normalizeEmail(),

  body("name")
    .trim()
    .notEmpty()
    .withMessage(AUTH_MESSAGES.NAME_REQUIRED)
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("role")
    .optional()
    .isIn([ROLES.ADMIN, ROLES.EMPLOYEE])
    .withMessage(AUTH_MESSAGES.ROLE_INVALID),

  body("avatar").optional().trim().isURL().withMessage(AUTH_MESSAGES.AVATAR_INVALID),

  validate,
];
