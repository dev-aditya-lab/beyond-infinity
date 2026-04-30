import express from "express";
import {
  getMe,
  logOutController,
  registerController,
  LoginController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateLogin, validateRegister } from "../validators/auth.validator.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegister, registerController);

authRouter.post("/login", validateLogin, LoginController);

authRouter.get("/me", authMiddleware, getMe);

authRouter.post("/logOut", authMiddleware, logOutController);

export default authRouter;
