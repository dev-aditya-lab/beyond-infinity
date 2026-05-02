import userModel from "../models/user.model.js";
import { generateOTP, hashOTP, verifyOTP } from "../utils/OtpSystem/generateOTP.js";
import { sendOTPEmail } from "../services/mail/mail.service.js";
import redisOTPService from "../services/redis/redis.otp.service.js";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis/redis.config.js";
import { AUTH_CONSTANTS, AUTH_MESSAGES, ROLES } from "../constants/auth.constants.js";
import { ENV } from "../config/env.config.js";
import OrganizationModel from "../models/organization.model.js";

const buildOrganizationName = (user) => {
  const baseName = user?.name?.trim() || user?.email?.split("@")[0] || "OpsPulse";
  return `${baseName}'s Organization`;
};

const ensureUserOrganization = async (user) => {
  if (user.organizationId) {
    return user.organizationId;
  }

  const organization = await OrganizationModel.create({
    name: buildOrganizationName(user),
    owner: user._id,
  });

  user.organizationId = organization._id;
  await user.save();

  return organization._id;
};

/**
 * Send OTP to email
 * Creates or updates user and sends OTP via Redis
 * @route POST /auth/send-otp
 */
export const sendOTPController = async (req, res) => {
  try {
    const { email, name, role, avatar } = req.body;
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedAvatar = typeof avatar === "string" ? avatar.trim() : "";

    // Find or create user
    let user = await userModel.findOne({ email });

    if (!user) {
      // Treat requests without a name as login attempts.
      // Login should not silently create new accounts.
      if (!normalizedName) {
        return res.status(404).json({
          success: false,
          message: AUTH_MESSAGES.LOGIN_USER_NOT_FOUND,
        });
      }

      const userPayload = {
        email,
        role: role || ROLES.EMPLOYEE,
        isVerified: false,
      };

      // Only persist optional fields when they contain meaningful values.
      if (normalizedName) userPayload.name = normalizedName;
      if (normalizedAvatar) userPayload.avatar = normalizedAvatar;

      user = await userModel.create(userPayload);
    } else {
      // Update user info if provided
      if (normalizedName) user.name = normalizedName;
      if (normalizedAvatar) user.avatar = normalizedAvatar;
      if (role) user.role = role;
      await user.save();
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: AUTH_MESSAGES.ACCOUNT_DISABLED,
      });
    }

    // ✅ Check rate limit using Redis
    const { canRequest, secondsLeft } = await redisOTPService.checkOTPRateLimit(email);

    if (!canRequest) {
      return res.status(429).json({
        success: false,
        message: AUTH_MESSAGES.OTP_RATE_LIMITED,
        retryAfter: secondsLeft,
      });
    }

    // ✅ Generate OTP and hash it
    const otp = generateOTP(AUTH_CONSTANTS.OTP_LENGTH);
    const hashedOTP = hashOTP(otp);

    // ✅ Store OTP in Redis (auto-expires after 5 minutes)
    await redisOTPService.storeOTP(email, hashedOTP);

    // ✅ Set rate limit in Redis (30 seconds)
    await redisOTPService.setOTPRateLimit(email);

    // ✅ Reset attempts counter
    await redisOTPService.resetOTPAttempts(email);

    // Send OTP via email
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.OTP_SENT,
      data: {
        email,
      },
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: AUTH_MESSAGES.SEND_OTP_ERROR,
    });
  }
};

/**
 * Verify OTP and login user
 * @route POST /auth/verify-otp
 */
export const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: AUTH_MESSAGES.USER_NOT_FOUND,
      });
    }

    // ✅ Check if OTP exists in Redis
    const otpExists = await redisOTPService.OTPExists(email);

    if (!otpExists) {
      return res.status(400).json({
        success: false,
        message: AUTH_MESSAGES.OTP_NOT_SENT,
      });
    }

    // ✅ Get current attempt count
    const attempts = await redisOTPService.getOTPAttempts(email);

    if (attempts >= AUTH_CONSTANTS.MAX_OTP_ATTEMPTS) {
      // Clear OTP and attempts
      await redisOTPService.clearAllOTPData(email);

      return res.status(403).json({
        success: false,
        message: AUTH_MESSAGES.OTP_ATTEMPTS_EXCEEDED,
      });
    }

    // ✅ Get stored OTP from Redis
    const storedHashedOTP = await redisOTPService.getOTP(email);

    // Verify OTP
    const isValid = verifyOTP(otp, storedHashedOTP);

    if (!isValid) {
      // Increment attempts
      const newAttempts = await redisOTPService.incrementOTPAttempts(email);
      const attemptsLeft = AUTH_CONSTANTS.MAX_OTP_ATTEMPTS - newAttempts;

      return res.status(400).json({
        success: false,
        message: AUTH_MESSAGES.INVALID_OTP,
        attemptsLeft,
      });
    }

    // ✅ OTP verification successful
    user.isVerified = true;
    user.lastLogin = new Date();
    // Organization is NOT auto-created here.
    // Users go through the onboarding page to create or join an org.
    await user.save();

    // ✅ Delete all OTP data from Redis
    await redisOTPService.clearAllOTPData(email);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      ENV.JWT_SECRET,
      { expiresIn: AUTH_CONSTANTS.JWT_EXPIRY }
    );

    // Use secure cookies only in production HTTPS environments.
    const cookieOptions = {
      ...AUTH_CONSTANTS.COOKIE_OPTIONS,
      secure: ENV.NODE_ENV === "production",
      sameSite: ENV.NODE_ENV === "production" ? "Strict" : "Lax",
    };

    res.cookie("token", token, cookieOptions);

    // Prepare user response (exclude sensitive fields)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      skills: user.skills,
      available: user.available,
      isVerified: user.isVerified,
    };

    return res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: AUTH_MESSAGES.VERIFY_OTP_ERROR,
    });
  }
};

/**
 * Get current authenticated user
 * @route GET /auth/me
 */
export const getMeController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: AUTH_MESSAGES.USER_NOT_FOUND,
      });
    }

    await ensureUserOrganization(user);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      skills: user.skills,
      available: user.available,
      isVerified: user.isVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.USER_FETCHED,
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Get Me Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

/**
 * Logout user
 * Clear token from cookies and blacklist token in Redis
 * @route POST /auth/logout
 */
export const logoutController = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: AUTH_MESSAGES.TOKEN_MISSING,
      });
    }

    // Clear cookie
    res.clearCookie("token");

    // Blacklist token in Redis for remaining JWT expiry time
    const tokenExpiry = 7 * 24 * 60 * 60; // 7 days in seconds (JWT_EXPIRY)
    await redisClient.set(token, "blacklisted", "EX", tokenExpiry);

    return res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: AUTH_MESSAGES.LOGOUT_ERROR,
    });
  }
};
