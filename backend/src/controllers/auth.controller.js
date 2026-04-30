import userModel from "../models/user.model.js";
import { generateOTP, hashOTP, verifyOTP } from "../utils/OtpSystem/generateOTP.js";
import { sendOTPEmail } from "../services/mail/mail.service.js";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis/redis.config.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, avatar, role } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    let user = await userModel.findOne({ email });

    // 🟢 CREATE USER IF NOT EXISTS (REGISTER STEP INSIDE OTP FLOW)
    if (!user) {
      user = await userModel.create({
        email,
        name: name || "",
        avatar: avatar || "",
        role: role,
        isVerified: false,
      });
    } else {
      // 🟡 OPTIONAL: update name/avatar if provided
      if (name || avatar) {
        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
      }
    }

    // ⛔ Rate limit (30 sec)
    if (user.lastOtpSent && Date.now() - user.lastOtpSent < 30000) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
      });
    }

    // ⛔ inactive check
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled",
      });
    }

    const otp = generateOTP(6);
    const hashedOTP = hashOTP(otp);

    user.otp = hashedOTP;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.lastOtpSent = Date.now();
    user.otpAttempts = 0;

    await user.save();

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const LoginController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const isValid = verifyOTP(otp, user.otp);

    if (!isValid) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ OTP SUCCESS → LOGIN COMPLETE

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;

    await user.save();

    // 🔐 JWT GENERATE
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      sameSite: "Strict",
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getMe = async (req, res) => {
  const user = await userModel.findById(req.user.id);

  try {
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const logOutController = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    res.clearCookie("token");

    await redisClient.set(token, Date.now().toString(), "EX", 60 * 60);

    res.status(200).json({
      message: "logout successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
