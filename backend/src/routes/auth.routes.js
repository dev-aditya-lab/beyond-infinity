import express from "express";
import { getMe, logOutController, sendOtp, verifyOtp } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/sendOtp", sendOtp);

authRouter.post("/verifyOtp", verifyOtp);

authRouter.get("/me", authMiddleware, getMe);

authRouter.post("/logOut", authMiddleware, logOutController);

export default authRouter;
