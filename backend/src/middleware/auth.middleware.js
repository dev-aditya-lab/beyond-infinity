import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { ENV } from "../config/env.config.js";
import redisClient from "../config/redis/redis.config.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const isTokenBlacklisted = await redisClient.get(token);

    if (isTokenBlacklisted) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // 🔓 verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    // 👤 get user
    const user = await userModel.findById(decoded.id).select("-otp");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // attach user to request

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};
