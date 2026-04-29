import userModel from "../models/user.model.js";
import { generateOTP, hashOTP } from "../utils/OtpSystem/generateOTP.js";
import { sendOTPEmail } from "../services/mail/mail.service.js";

export const sendOtp = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        name,
      });
    }

    // ⛔ Rate limit (30 sec)
    if (user.lastOtpSent && Date.now() - user.lastOtpSent < 30000) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
      });
    }

    const otp = generateOTP(6);

    const hashedOTP = hashOTP(otp);

    user.otp = hashedOTP;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min
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

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: true,
        message: "Email and Otp are required",
      });
    }

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
        message: "OTP not found please request a new one.",
      });
    }

    if (Date.now() > user.otpExpires) {
      ((user.otp = undefined), (user.otpExpires = undefined), (user.otpAttempts = 0));

      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "To many failed attempts. Request a new OTP.",
      });
    }

    const hashedInputOtp = hashOTP(otp);

    // ❌ Invalid OTP
    if (hashedInputOtp !== user.otp) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ OTP verified successfully
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    user.lastOtpSent = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
