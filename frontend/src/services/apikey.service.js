/**
 * API Key Service
 * Handles all API key management:
 * - List API keys
 * - Create API key
 * - Revoke API key
 */

import apiClient from './apiClient.js'
import { API_ENDPOINTS } from '../config/api.js'

export const apikeyService = {
  /**
   * Fetch all API keys
   * @returns {Promise} - List of API keys
   */
  getKeys: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.API_KEYS_LIST)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch API keys')
    }
  },

  /**
   * Create new API key
   * @param {Object} data - Key creation data (name, description)
   * @returns {Promise} - Created API key
   */
  createKey: async (data) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.API_KEYS_CREATE, data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create API key')
    }
  },

  /**
   * Revoke API key
   * @param {string} id - API key ID
   * @returns {Promise} - Revoke response
   */
  revokeKey: async (id) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.API_KEYS_REVOKE(id))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to revoke API key')
    }
  },

  /**
   * Get API key details
   * @param {string} id - API key ID
   * @returns {Promise} - API key details
   */
  getKeyById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.API_KEYS_DETAIL(id))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch API key')
    }
  },
}

export default apikeyService
