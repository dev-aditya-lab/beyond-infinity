import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config.js";
import { userModel } from "../Models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await userModel.findOne({ email });

        if (!user) {
          user = await userModel.create({
            username: profile.displayName,
            email,
            password: "google-oauth",
            isVerified: true,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
