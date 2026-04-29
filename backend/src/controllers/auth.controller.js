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

