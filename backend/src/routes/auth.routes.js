import express from "express";
import { sendOtp } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", sendOtp);

export default authRouter;
