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
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 3, max: 10 })
    .withMessage("Username must be between 3 To 10"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("passwor must be atleast 6 character"),

  validate,
];

export const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("password is required"),

  validate,
];
