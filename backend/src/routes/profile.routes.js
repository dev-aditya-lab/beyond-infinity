/**
 * Profile Routes
 * User profile CRUD and organization member management
 */

import express from "express";
import { body, param } from "express-validator";
import { isValidObjectId } from "mongoose";
import { verifyJWTMiddleware } from "../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  getOrganizationMembers,
  addOrganizationMember,
  removeOrganizationMember,
  updateMemberRole,
  createOrganization,
} from "../controllers/profile.controller.js";

const router = express.Router();

// All profile routes require authentication
router.use(verifyJWTMiddleware);

/**
 * GET /api/profile
 * Get current user's full profile
 */
router.get("/", getProfile);

/**
 * POST /api/profile/organization
 * Create a new organization (onboarding)
 */
router.post(
  "/organization",
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Organization name is required (2-100 chars)"),
  createOrganization
);

/**
 * PUT /api/profile
 * Update current user's profile
 */
router.put(
  "/",
  body("name").optional().trim().isLength({ min: 2, max: 50 }),
  body("phone").optional().trim().isLength({ max: 20 }),
  body("bio").optional().trim().isLength({ max: 300 }),
  body("skills").optional().isArray(),
  body("available").optional().isBoolean(),
  body("avatar").optional().trim().isURL(),
  updateProfile
);

/**
 * GET /api/profile/members
 * List all organization members (admin only)
 */
router.get("/members", getOrganizationMembers);

/**
 * POST /api/profile/members
 * Add member to organization (admin only)
 */
router.post(
  "/members",
  body("email").isEmail().withMessage("Valid email is required"),
  body("name").optional().trim().isLength({ min: 2, max: 50 }),
  body("role")
    .optional()
    .isIn(["admin", "responder", "employee"])
    .withMessage("Role must be admin, responder, or employee"),
  addOrganizationMember
);

/**
 * DELETE /api/profile/members/:id
 * Remove member from organization (admin only)
 */
router.delete(
  "/members/:id",
  param("id").custom(isValidObjectId).withMessage("Invalid member ID"),
  removeOrganizationMember
);

/**
 * PUT /api/profile/members/:id/role
 * Update member role (admin only)
 */
router.put(
  "/members/:id/role",
  param("id").custom(isValidObjectId).withMessage("Invalid member ID"),
  body("role")
    .isIn(["admin", "responder", "employee"])
    .withMessage("Role must be admin, responder, or employee"),
  updateMemberRole
);

export default router;
