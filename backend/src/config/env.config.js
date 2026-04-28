import "dotenv/config";
/**
 * Helper to get env variable safely
 */
const getEnv = (key, defaultValue = null, required = false) => {
  const value = process.env[key] || defaultValue;

  if (required && !value) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1); // stop app immediately
  }

  return value;
};

/**
 * All env variables in one object
 */
export const ENV = {
  PORT: getEnv("PORT", 5000),
  MONGO_URI: getEnv("MONGO_URI", "", true),
  JWT_SECRET: getEnv("JWT_SECRET", "", true),

  REDIS_URL: getEnv("REDIS_URL"),

  MAIL_API_KEY: getEnv("MAIL_API_KEY"),

  NODE_ENV: getEnv("NODE_ENV", "development"),
};