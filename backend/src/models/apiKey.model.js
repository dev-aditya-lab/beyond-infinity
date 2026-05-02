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

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
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

export default mongoose.models.ApiKey || mongoose.model("ApiKey", apiKeySchema);
