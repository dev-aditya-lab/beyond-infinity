import express from "express";
import { getMe, sendOtp, verifyOtp } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/sendOtp", sendOtp);

authRouter.post("/verifyOtp", verifyOtp);

authRouter.get("/me", authMiddleware, getMe);

export default authRouter;
