import express from "express";
import {
  sendOTPController,
  verifyOTPController,
  getMeController,
  logoutController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateSendOTP, validateVerifyOTP } from "../validators/auth.validator.js";

const authRouter = express.Router();

/**
 * @route POST /auth/send-otp
 * @desc Send OTP to email
 * @access Public
 * @body {email, name?, role?, avatar?}
 */
authRouter.post("/send-otp", validateSendOTP, sendOTPController);

/**
 * @route POST /auth/verify-otp
 * @desc Verify OTP and login user
 * @access Public
 * @body {email, otp}
 */
authRouter.post("/verify-otp", validateVerifyOTP, verifyOTPController);

/**
 * @route GET /auth/me
 * @desc Get current authenticated user
 * @access Private
 */
authRouter.get("/me", authMiddleware, getMeController);

/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Private
 */
authRouter.post("/logout", authMiddleware, logoutController);

export default authRouter;
