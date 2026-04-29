import express from "express";
import connectToDB from "./config/Database/database.js";
import authRoute from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.js";

connectToDB();

const app = express();
app.use(passport.initialize());
app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoute);

export default app;
