/**
 * Dashboard Service
 * Handles dashboard-related API calls:
 * - GET /api/dashboard/stats   → Comprehensive dashboard stats
 * - GET /api/dashboard/trends  → Incident trend data for charts
 */

import apiClient from './apiClient.js'
import { API_ENDPOINTS } from '../config/api.js'

export const dashboardService = {
  /**
   * Get comprehensive dashboard statistics
   * @returns {Promise} - { success, data: stats }
   */
  getStats: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_STATS)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats')
    }
  },

  /**
   * Get incident trend data for charts
   * @param {number} days - Number of days (1-90, default: 7)
   * @returns {Promise} - { success, data: trend[], period }
   */
  getTrends: async (days = 7) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_TRENDS, {
        params: { days },
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch trends')
    }
  },
}

export default dashboardService
