import Redis from "ioredis";
import { ENV } from "../env.config.js";

/**
 * Create Redis Client
 */
const redisClient = new Redis({
  host: ENV.REDIS.HOST,
  port: ENV.REDIS.PORT,
  username: ENV.REDIS.USERNAME,
  password: ENV.REDIS.PASSWORD,

  // Recommended options
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true, // connect manually

  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 2000);
    console.warn(`🔁 Redis retry attempt ${times}, retrying in ${delay}ms`);
    return delay;
  },
});

/**
 * Connect Redis manually
 */
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected");
  } catch (error) {
    console.error("❌ Redis connection failed:", error.message);
    process.exit(1); // fail fast
  }
};

/**
 * Disconnect Redis
 */
export const disconnectRedis = async () => {
  try {
    await redisClient.quit();
    console.log("🔌 Redis disconnected");
  } catch (error) {
    console.error("❌ Redis disconnect error:", error.message);
  }
};

/**
 * Event Listeners
 */
redisClient.on("ready", () => {
  console.log("📦 Redis ready to use");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

redisClient.on("end", () => {
  console.warn("⚠️ Redis connection closed");
});

/**
 * Export client
 */
export default redisClient;