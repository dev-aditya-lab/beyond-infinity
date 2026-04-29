import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import redis from "../config/redis/redis.config.js";
export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const isTokenBlacklisted = await redis.get(token);

    if (isTokenBlacklisted) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.user = decoded; // { id, role }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
