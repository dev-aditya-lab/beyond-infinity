import { userModel } from "../Models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../services/mail/mail.service.js";
import { config } from "../config/config.js";
import redis from "../config/redis/redis.config.js";

export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User Already Registered",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await userModel.create({
      username,
      email,
      password,
      verificationToken,
      verificationTokenExpiry: Date.now() + 10 * 60 * 1000,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("error", error);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await userModel.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;

    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first ",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMeController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      message: "User fetched successfull",
      user,
    });
  } catch (error) {}
};

export const logOutController = async (req, res) => {
  try {
    const token = req.cookies.token;

    res.clearCookie("token");

    await redis.set(token, Date.now().toString(), "EX", 60 * 60);

    res.status(200).json({
      message: "logout successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const googleAuth = (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    res.redirect(`${config.CLIENT_URL}/home`);
  } catch (error) {}
};
