import mongoose from "mongoose";
import { ENV } from "../env.config.js";

/**
 * MongoDB connection instance
 */
let isConnected = false;

/**
 * Connect to MongoDB
 */
export const connectDB = async () => {
  if (isConnected) {
    console.log("⚡ MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000, // fail fast
    });

    isConnected = conn.connections[0].readyState === 1;

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);

    // fail fast (important in backend systems)
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("🔌 MongoDB Disconnected");
  } catch (error) {
    console.error("❌ Error disconnecting MongoDB:", error.message);
  }
};

/**
 * Handle connection events (recommended)
 */
export const initDBEvents = () => {
  mongoose.connection.on("connected", () => {
    console.log("📡 Mongoose connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ Mongoose error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ Mongoose disconnected");
  });
};