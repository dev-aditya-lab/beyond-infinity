import express from "express";
import { sendOtp, verifyOtp } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/sendOtp", sendOtp);

authRouter.post("/verifyOtp", verifyOtp);

export default authRouter;
