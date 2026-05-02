import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    role: {
      type: String,
      enum: ["admin", "responder", "employee"],
      default: "employee",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },

    // Skills as array of tags for AI assignment matching
    // e.g. ["payment", "database", "api", "frontend"]
    skills: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/di77yygcs/image/upload/v1777048491/blog/csyh9zademalguzxpr9a.jpg",
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    // Assignment engine fields
    available: {
      type: Boolean,
      default: true,
    },

    activeIncidents: {
      type: Number,
      default: 0,
      min: 0,
    },

    performanceScore: {
      type: Number,
      default: 0.5,
      min: 0,
      max: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
