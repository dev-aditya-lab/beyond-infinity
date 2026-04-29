import crypto from "crypto";

/**
 * Generate secure OTP
 * @param {number} length - length of OTP (default 6)
 * @returns {string}
 */
export const generateOTP = (length = 6) => {
  // Validate length
  if (!Number.isInteger(length) || length < 4 || length > 10) {
    throw new Error("OTP length must be between 4 and 10");
  }

  const max = 10 ** length;

  const otp = crypto.randomInt(0, max).toString().padStart(length, "0");

  return otp;
};

/**
 * Hash OTP before storing (recommended)
 */
export const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

/**
 * Compare OTP securely
 */
//! it returns true if OTP is valid, false otherwise

export const verifyOTP = (inputOtp, storedHashedOtp) => {
  if (!inputOtp || !storedHashedOtp) return false;

  const hashedInput = hashOTP(inputOtp);

  const a = Buffer.from(hashedInput);
  const b = Buffer.from(storedHashedOtp);

  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
};
