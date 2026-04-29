import express from "express";
import { validateLogin, validateRegister } from "../validators/auth.validator.js";
import {
  getMeController,
  googleAuth,
  loginController,
  logOutController,
  registerController,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import passport from "passport";

const authRoute = express.Router();

authRoute.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRoute.get("/google/callback", passport.authenticate("google", { session: false }), googleAuth);

authRoute.post("/register", validateRegister, registerController);

authRoute.get("/verify/:token", verifyEmail);

authRoute.post("/login", validateLogin, loginController);

authRoute.get("/me", authUser, getMeController);

authRoute.post("/logout", authUser, logOutController);

export default authRoute;
