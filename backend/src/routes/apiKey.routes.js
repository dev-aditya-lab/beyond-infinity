import { Router } from "express";
import { createApiKey, getAllApiKeys, revokeApiKey } from "../controllers/apiKey.controller.js";
import { verifyJWTMiddleware } from "../middleware/auth.middleware.js";

const apiRouter = Router();

// 🔐 All routes protected
apiRouter.use(verifyJWTMiddleware);

/**
 * @route   POST /api/keys
 * @desc    Generate new API key
 */
apiRouter.post("/", createApiKey);

/**
 * @route   GET /api/keys
 * @desc    Get all API keys for logged-in user
 */
apiRouter.get("/", getAllApiKeys);

/**
 * @route   DELETE /api/keys/:id
 * @desc    Revoke API key by ID
 * @param   id - API key ID to revoke
 */
apiRouter.delete("/:id", revokeApiKey);

export default apiRouter;
