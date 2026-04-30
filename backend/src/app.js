import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import { ENV } from "./config/env.config.js";
import apiRouter from "./routes/apiKey.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

/**
 * ---------------- Middleware ----------------
 */

app.use(morgan(ENV.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * ---------------- Routes ----------------
 */

app.use("/api/keys", apiRouter);
app.use("/api/auth", authRouter);

/**
 * ---------------- Health Check ----------------
 */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
  });
});

/**
 * ---------------- 404 Handler ----------------
 */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/**
 * ---------------- Global Error Handler ----------------
 */

app.use((err, req, res, _next) => {
  console.error("❌ Error:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: ENV.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
});

export default app;
