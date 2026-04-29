import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    name: {
      type: String, // e.g. "Frontend App", "Mobile App"
      required: true,
    },

    keyHash: {
      type: String,
      required: true,
      index: true,
    },

    prefix: {
      type: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    keyId: {
      type: String,
      required: true,
      unique: true,
    },

    lastUsedAt: Date,

    expiresAt: Date,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ApiKey", apiKeySchema);
