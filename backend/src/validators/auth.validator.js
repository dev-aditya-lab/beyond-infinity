import { body, validationResult } from "express-validator";

function validate(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  res.status(400).json({
    errors: errors.array(),
  });
}

export const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),

  body("email").isEmail().withMessage("Valid email required"),

  body("role").optional().isIn(["admin", "employee"]),

  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),

  validate,
];

export const validateLogin = [
  body("email").isEmail().withMessage("Valid email required"),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits"),

  validate,
];
