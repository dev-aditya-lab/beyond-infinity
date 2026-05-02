/**
 * Profile Service
 * Handles user profile and organization member management:
 * - GET  /api/profile              → Get current user profile
 * - PUT  /api/profile              → Update profile
 * - GET  /api/profile/members      → List org members (admin)
 * - POST /api/profile/members      → Add member (admin)
 * - DELETE /api/profile/members/:id → Remove member (admin)
 * - PUT  /api/profile/members/:id/role → Update role (admin)
 */

import apiClient from './apiClient.js'
import { API_ENDPOINTS } from '../config/api.js'

export const profileService = {
  /**
   * Get current user's full profile
   * @returns {Promise} - { success, data: user }
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROFILE)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile')
    }
  },

  /**
   * Update current user's profile
   * @param {Object} data - { name, phone, bio, skills, available, avatar }
   * @returns {Promise} - { success, data: updatedUser }
   */
  updateProfile: async (data) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.PROFILE_UPDATE, data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile')
    }
  },

  /**
   * Create a new organization (onboarding)
   * @param {Object} data - { name }
   * @returns {Promise} - { success, data: updatedUser }
   */
  createOrganization: async (data) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PROFILE_CREATE_ORG, data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create organization')
    }
  },

  /**
   * Get all members of the user's organization (admin only)
   * @returns {Promise} - { success, data: { members, count } }
   */
  getMembers: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MEMBERS_LIST)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch members')
    }
  },

  /**
   * Add a new member to the organization (admin only)
   * @param {Object} data - { email, name?, role? }
   * @returns {Promise} - { success, data: member }
   */
  addMember: async (data) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.MEMBERS_ADD, data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add member')
    }
  },

  /**
   * Remove a member from the organization (admin only)
   * @param {string} id - Member user ID
   * @returns {Promise}
   */
  removeMember: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.MEMBERS_REMOVE(id))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove member')
    }
  },

  /**
   * Update a member's role (admin only)
   * @param {string} id - Member user ID
   * @param {string} role - New role ('admin' | 'responder' | 'employee')
   * @returns {Promise}
   */
  updateMemberRole: async (id, role) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.MEMBERS_UPDATE_ROLE(id), { role })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update role')
    }
  },
}

export default profileService
