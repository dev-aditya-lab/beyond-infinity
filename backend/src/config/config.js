import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not define in environment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not define in environment variables");
}

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not define in environment variables");
}

if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL is not define in environment variables");
}

if (!process.env.REDIS_HOST) {
  throw new Error("REDIS_HOST is not define in environment variables");
}

if (!process.env.REDIS_PORT) {
  throw new Error(" REDIS_PORT is not define in environment variables");
}

if (!process.env.REDIS_PASSWORD) {
  throw new Error("REDIS_PASSWORD is not define in environment variables");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET is not define in environment variables");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not define in environment variables");
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};
