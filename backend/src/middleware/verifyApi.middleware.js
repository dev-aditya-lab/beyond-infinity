import bcrypt from "bcryptjs";
import apiKeyModel from "../models/apiKey.model.js";
import { ENV } from "../config/env.config.js";

export const verifyApiMiddleware = async (req, res, next) => {
  try {
    const key = req.headers["x-api-key"];

    if (!key) {
      return res.status(401).json({ message: "API key missing" });
    }

    const prefix = key.split("_")[0];

    const keys = await apiKeyModel.find({ prefix, isActive: true });

    for (let k of keys) {
      const isMatch = await bcrypt.compare(key, k.keyHash);
      if (isMatch) {
        k.lastUsedAt = new Date();
        await k.save();

        req.apiUser = k.user;
        return next();
      }
    }

    return res.status(401).json({ message: "Invalid API key" });
  } catch (err) {
    return res.status(500).json({
      message: "Server error during API key verification",
      error: ENV.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
  }
};
