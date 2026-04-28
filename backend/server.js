import "dotenv/config";
import http from "http";
import app from "./src/app.js";

import { ENV } from "./src/config/env.config.js";
import { connectDB, disconnectDB, initDBEvents } from "./src/config/Database/database.js";
import { initSocketServer } from "./src/sockets/server.socket.js";

/**
 * Create HTTP Server
 */
const httpServer = http.createServer(app);

/**
 * Bootstrap Application
 */
const startServer = async () => {
  try {
    console.log("🚀 Starting server...");

    // Init DB event listeners
    initDBEvents();

    // Connect Database
    await connectDB();

    // Init Socket AFTER server created
    initSocketServer(httpServer);

    // Start Server
    httpServer.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
      console.log(`Environment: ${ENV.NODE_ENV}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

/**
 * Graceful Shutdown Handler
 */
const shutdown = async (signal) => {
  console.log(`\n⚠️ Received ${signal}. Shutting down gracefully...`);

  try {
    await disconnectDB();

    httpServer.close(() => {
      console.log("💤 Server closed");
      process.exit(0);
    });

  } catch (error) {
    console.error("❌ Error during shutdown:", error.message);
    process.exit(1);
  }
};

/**
 * Handle process events
 */
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
  process.exit(1);
});

/**
 * Start App
 */
startServer();