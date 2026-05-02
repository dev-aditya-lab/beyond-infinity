import redisClient from "../../config/redis/redis.config.js";
import { AUTH_CONSTANTS } from "../../constants/auth.constants.js";

/**
 * Redis OTP Service
 * Handles all OTP operations efficiently using Redis TTL
 * Key patterns:
 * - otp:{email} → {otp_hash}
 * - otp:attempts:{email} → {attempt_count}
 * - otp:rate-limit:{email} → {last_request_timestamp}
 */

const OTP_KEY_PREFIX = "otp";
const ATTEMPTS_KEY_PREFIX = "otp:attempts";
const RATE_LIMIT_KEY_PREFIX = "otp:rate-limit";

/**
 * Store OTP in Redis with auto-expiry
 * @param {string} email - User email
 * @param {string} hashedOTP - Hashed OTP
 * @returns {Promise<void>}
 */
export const storeOTP = async (email, hashedOTP) => {
  const key = `${OTP_KEY_PREFIX}:${email}`;
  const ttl = AUTH_CONSTANTS.OTP_EXPIRY_MINUTES * 60; // Convert to seconds

  await redisClient.setex(key, ttl, hashedOTP);
};

/**
 * Retrieve OTP from Redis
 * @param {string} email - User email
 * @returns {Promise<string|null>} - Hashed OTP or null
 */
export const getOTP = async (email) => {
  const key = `${OTP_KEY_PREFIX}:${email}`;
  return await redisClient.get(key);
};

/**
 * Delete OTP from Redis
 * @param {string} email - User email
 * @returns {Promise<number>} - Number of keys deleted
 */
export const deleteOTP = async (email) => {
  const key = `${OTP_KEY_PREFIX}:${email}`;
  return await redisClient.del(key);
};

/**
 * Check if OTP exists in Redis (not expired)
 * @param {string} email - User email
 * @returns {Promise<boolean>}
 */
export const OTPExists = async (email) => {
  const key = `${OTP_KEY_PREFIX}:${email}`;
  return (await redisClient.exists(key)) === 1;
};

/**
 * Get remaining TTL for OTP in seconds
 * @param {string} email - User email
 * @returns {Promise<number>} - TTL in seconds (-2 if not exists, -1 if no expiry)
 */
export const getOTPTTL = async (email) => {
  const key = `${OTP_KEY_PREFIX}:${email}`;
  return await redisClient.ttl(key);
};

/**
 * Check rate limit for OTP requests
 * @param {string} email - User email
 * @returns {Promise<{canRequest: boolean, secondsLeft: number}>}
 */
export const checkOTPRateLimit = async (email) => {
  const key = `${RATE_LIMIT_KEY_PREFIX}:${email}`;
  const lastRequestTime = await redisClient.get(key);

  if (!lastRequestTime) {
    return { canRequest: true, secondsLeft: 0 };
  }

  const lastTime = parseInt(lastRequestTime, 10);
  const now = Date.now();
  const timeSinceLastRequest = now - lastTime;
  const rateLimitMs = AUTH_CONSTANTS.OTP_RATE_LIMIT_SECONDS * 1000;

  if (timeSinceLastRequest < rateLimitMs) {
    const secondsLeft = Math.ceil((rateLimitMs - timeSinceLastRequest) / 1000);
    return { canRequest: false, secondsLeft };
  }

  return { canRequest: true, secondsLeft: 0 };
};

/**
 * Set rate limit for OTP requests
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const setOTPRateLimit = async (email) => {
  const key = `${RATE_LIMIT_KEY_PREFIX}:${email}`;
  const ttl = AUTH_CONSTANTS.OTP_RATE_LIMIT_SECONDS;

  await redisClient.setex(key, ttl, Date.now().toString());
};

/**
 * Increment OTP attempt counter
 * @param {string} email - User email
 * @returns {Promise<number>} - New attempt count
 */
export const incrementOTPAttempts = async (email) => {
  const key = `${ATTEMPTS_KEY_PREFIX}:${email}`;
  const ttl = AUTH_CONSTANTS.OTP_EXPIRY_MINUTES * 60; // Same as OTP expiry

  const attempts = await redisClient.incr(key);

  // Set TTL on first increment
  if (attempts === 1) {
    await redisClient.expire(key, ttl);
  }

  return attempts;
};

/**
 * Get current OTP attempt count
 * @param {string} email - User email
 * @returns {Promise<number>} - Current attempt count
 */
export const getOTPAttempts = async (email) => {
  const key = `${ATTEMPTS_KEY_PREFIX}:${email}`;
  const attempts = await redisClient.get(key);
  return attempts ? parseInt(attempts, 10) : 0;
};

/**
 * Reset OTP attempts counter
 * @param {string} email - User email
 * @returns {Promise<number>} - Number of keys deleted
 */
export const resetOTPAttempts = async (email) => {
  const key = `${ATTEMPTS_KEY_PREFIX}:${email}`;
  return await redisClient.del(key);
};

/**
 * Delete all OTP-related data for a user
 * @param {string} email - User email
 * @returns {Promise<number>} - Number of keys deleted
 */
export const clearAllOTPData = async (email) => {
  const keys = [
    `${OTP_KEY_PREFIX}:${email}`,
    `${ATTEMPTS_KEY_PREFIX}:${email}`,
    `${RATE_LIMIT_KEY_PREFIX}:${email}`,
  ];

  return await redisClient.del(...keys);
};

/**
 * Get OTP stats for debugging/monitoring
 * @param {string} email - User email
 * @returns {Promise<object>} - OTP statistics
 */
export const getOTPStats = async (email) => {
  const otpExists = await OTPExists(email);
  const ttl = await getOTPTTL(email);
  const attempts = await getOTPAttempts(email);
  const rateLimit = await checkOTPRateLimit(email);

  return {
    otpExists,
    ttlSeconds: ttl,
    attempts,
    canRequestNewOTP: rateLimit.canRequest,
    rateLimitSecondsLeft: rateLimit.secondsLeft,
  };
};

export default {
  storeOTP,
  getOTP,
  deleteOTP,
  OTPExists,
  getOTPTTL,
  checkOTPRateLimit,
  setOTPRateLimit,
  incrementOTPAttempts,
  getOTPAttempts,
  resetOTPAttempts,
  clearAllOTPData,
  getOTPStats,
};
