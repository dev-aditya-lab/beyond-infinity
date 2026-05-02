/**
 * Profile Controller
 * Handles user profile CRUD and organization member management
 * - GET /profile → get current user profile
 * - PUT /profile → update profile (name, phone, bio, skills, available, avatar)
 * - GET /profile/members → list org members (admin only)
 * - POST /profile/members → add member to org (admin only)
 * - DELETE /profile/members/:id → remove member (admin only)
 * - PUT /profile/members/:id/role → change member role (admin only)
 */

import UserModel from "../models/user.model.js";
import OrganizationModel from "../models/organization.model.js";
import { validationResult } from "express-validator";

/**
 * GET /api/profile
 * Get current authenticated user's full profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id)
      .populate("organizationId", "name owner isActive createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove sensitive fields
    delete user.__v;

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("❌ Get Profile Error:", err.message);
    next(err);
  }
};

/**
 * PUT /api/profile
 * Update current user's profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, phone, bio, skills, available, avatar } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (available !== undefined) updateData.available = available;

    // Skills: accept array of strings, normalize to lowercase
    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({
          success: false,
          message: "Skills must be an array of strings",
        });
      }
      updateData.skills = skills
        .filter((s) => typeof s === "string" && s.trim().length > 0)
        .map((s) => s.trim().toLowerCase());
    }

    const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("organizationId", "name owner isActive createdAt")
      .lean();

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    delete updatedUser.__v;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("❌ Update Profile Error:", err.message);
    next(err);
  }
};

/**
 * GET /api/profile/members
 * List all members of the current user's organization (admin only)
 */
export const getOrganizationMembers = async (req, res, next) => {
  try {
    if (!req.user.organizationId) {
      return res.status(400).json({
        success: false,
        message: "User does not belong to an organization",
      });
    }

    // Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const members = await UserModel.find({
      organizationId: req.user.organizationId,
    })
      .select(
        "name email role skills avatar available activeIncidents performanceScore isActive lastLogin createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        members,
        count: members.length,
      },
    });
  } catch (err) {
    console.error("❌ Get Organization Members Error:", err.message);
    next(err);
  }
};

/**
 * POST /api/profile/members
 * Add a new member to the organization (admin only)
 * Creates user if doesn't exist, or links existing user to org
 */
export const addOrganizationMember = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    if (!req.user.organizationId) {
      return res.status(400).json({
        success: false,
        message: "You must belong to an organization first",
      });
    }

    const { email, name, role = "employee" } = req.body;

    // Check if user already exists
    let user = await UserModel.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      // If user already belongs to this org
      if (
        user.organizationId &&
        user.organizationId.toString() === req.user.organizationId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: "User is already a member of this organization",
        });
      }

      // If user belongs to another org
      if (user.organizationId) {
        return res.status(400).json({
          success: false,
          message: "User already belongs to another organization",
        });
      }

      // Link existing user to this org
      user.organizationId = req.user.organizationId;
      user.role = role;
      if (name) user.name = name;
      await user.save();
    } else {
      // Create new user
      user = await UserModel.create({
        email: email.toLowerCase().trim(),
        name: name || email.split("@")[0],
        role,
        organizationId: req.user.organizationId,
        isVerified: false,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        available: user.available,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    console.error("❌ Add Organization Member Error:", err.message);
    next(err);
  }
};

/**
 * DELETE /api/profile/members/:id
 * Remove member from organization (admin only)
 * Does not delete the user — just unlinks from org
 */
export const removeOrganizationMember = async (req, res, next) => {
  try {
    // Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { id } = req.params;

    // Prevent admin from removing themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove yourself from the organization",
      });
    }

    const member = await UserModel.findOne({
      _id: id,
      organizationId: req.user.organizationId,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found in your organization",
      });
    }

    // Unlink from organization
    member.organizationId = null;
    member.role = "employee";
    await member.save();

    return res.status(200).json({
      success: true,
      message: "Member removed from organization",
    });
  } catch (err) {
    console.error("❌ Remove Organization Member Error:", err.message);
    next(err);
  }
};

/**
 * PUT /api/profile/members/:id/role
 * Update member's role (admin only)
 */
export const updateMemberRole = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { id } = req.params;
    const { role } = req.body;

    // Prevent admin from changing their own role
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    const member = await UserModel.findOneAndUpdate(
      { _id: id, organizationId: req.user.organizationId },
      { role },
      { new: true, runValidators: true }
    ).lean();

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found in your organization",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Role updated to ${role}`,
      data: {
        _id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
      },
    });
  } catch (err) {
    console.error("❌ Update Member Role Error:", err.message);
    next(err);
  }
};

/**
 * POST /api/profile/organization
 * Create a new organization (onboarding flow)
 * Sets the current user as admin and owner
 */
export const createOrganization = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Check if user already has an org
    if (req.user.organizationId) {
      return res.status(400).json({
        success: false,
        message: "You already belong to an organization",
      });
    }

    const { name } = req.body;

    // Create organization
    const organization = await OrganizationModel.create({
      name: name.trim(),
      owner: req.user._id,
    });

    // Update user: link to org and set as admin
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        organizationId: organization._id,
        role: "admin",
      },
      { new: true, runValidators: true }
    )
      .populate("organizationId", "name owner isActive createdAt")
      .lean();

    delete updatedUser.__v;

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("❌ Create Organization Error:", err.message);
    next(err);
  }
};

export default {
  getProfile,
  updateProfile,
  getOrganizationMembers,
  addOrganizationMember,
  removeOrganizationMember,
  updateMemberRole,
  createOrganization,
};
