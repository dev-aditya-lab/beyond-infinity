/**
 * Organization Service
 * Handles organization CRUD:
 * - GET  /api/organizations/:id → Get org details
 * - PUT  /api/organizations/:id → Update org details (admin)
 */

import apiClient from './apiClient.js'
import { API_ENDPOINTS } from '../config/api.js'

export const organizationService = {
  /**
   * Get organization details by ID
   * @param {string} id - Organization ID
   * @returns {Promise} - { success, data: org }
   */
  getOrganization: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORG_DETAIL(id))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch organization')
    }
  },

  /**
   * Update organization details (admin only)
   * @param {string} id - Organization ID
   * @param {Object} data - { name, description, contactEmail }
   * @returns {Promise} - { success, data: updatedOrg }
   */
  updateOrganization: async (id, data) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.ORG_UPDATE(id), data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update organization')
    }
  },
}

export default organizationService
