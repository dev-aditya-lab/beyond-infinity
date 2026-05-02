/**
 * Health Service
 * Handles health monitoring API calls:
 * - GET  /api/health          → All services health
 * - GET  /api/health/:service → Specific service health
 * - POST /api/health/report   → Report health status
 */

import apiClient from './apiClient.js'
import { API_ENDPOINTS } from '../config/api.js'

export const healthService = {
  /**
   * Get all services health for the organization
   * @returns {Promise} - { success, data: health[], count }
   */
  getAllHealth: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HEALTH_LIST)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch health data')
    }
  },

  /**
   * Get specific service health
   * @param {string} service - Service name
   * @returns {Promise} - { success, data: healthRecord }
   */
  getServiceHealth: async (service) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HEALTH_SERVICE(service))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service health')
    }
  },
}

export default healthService
