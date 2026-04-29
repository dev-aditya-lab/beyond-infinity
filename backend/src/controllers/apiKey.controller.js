import crypto from "crypto";
import ApiKey from "../models/apiKey.model.js";
import { generateApiKey } from "../utils/apiKeyGenerater/apiGenerater.js";

/**
 * 🔐 Generate API Key
 */
const generateKey = async () => {
  const apiDetails = await generateApiKey();
  const keyId = crypto.randomBytes(8).toString("hex");

  return {
    rawKey: apiDetails.fullKey,
    hash: apiDetails.hash,
    prefix: apiDetails.prefix,
    keyId,
  };
};

/**
 * 🚀 Create API Key
 */
export const createApiKey = async (req, res) => {
  try {
    const { name, permissions = [] } = req.body;

    const { rawKey, hash, prefix, keyId } = await generateKey();

    const apiKey = await ApiKey.create({
      name: name || "Default Key",
      keyHash: hash,
      prefix,
      keyId,
      user: req.user._id,
      permissions,
    });

    return res.status(201).json({
      message: "API key created successfully",
      apiKey: {
        id: apiKey._id,
        name: apiKey.name,
        prefix: apiKey.prefix,
        keyId: apiKey.keyId,
        createdAt: apiKey.createdAt,
      },
      key: rawKey, // ⚠️ show only once
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * 📋 Get All API Keys
 */
export const getAllApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.find({
      user: req.user._id,
    })
      .select("-keyHash")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: keys.length,
      apiKeys: keys,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * ❌ Revoke API Key (Soft delete)
 */
export const revokeApiKey = async (req, res) => {
  try {
    const { id } = req.params;

    const apiKey = await ApiKey.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
      },
      {
        isActive: false,
      },
      { new: true }
    );

    if (!apiKey) {
      return res.status(404).json({
        message: "API key not found",
      });
    }

    return res.status(200).json({
      message: "API key revoked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
