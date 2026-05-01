/**
 * Incident Service
 * Handles all incident-related API calls:
 * - List incidents
 * - Get incident details
 * - Create incident
 * - Update incident
 * - Delete incident
 */

import apiClient from './apiClient.js'
import { API_ENDPOINTS } from '../config/api.js'

export const incidentService = {
  /**
   * Fetch all incidents with optional filters
   * @param {Object} filters - Filter parameters (status, severity, page, limit)
   * @returns {Promise} - List of incidents
   */
  getIncidents: async (filters = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.INCIDENTS_LIST, {
        params: filters,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch incidents')
    }
  },

  /**
   * Get single incident by ID
   * @param {string} id - Incident ID
   * @returns {Promise} - Incident details
   */
  getIncidentById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.INCIDENTS_DETAIL(id))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch incident')
    }
  },

  /**
   * Create new incident
   * @param {Object} data - Incident data
   * @returns {Promise} - Created incident
   */
  createIncident: async (data) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.INCIDENTS_CREATE, data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create incident')
    }
  },

  /**
   * Update incident
   * @param {string} id - Incident ID
   * @param {Object} data - Update data
   * @returns {Promise} - Updated incident
   */
  updateIncident: async (id, data) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.INCIDENTS_UPDATE(id), data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update incident')
    }
  },

  /**
   * Delete incident
   * @param {string} id - Incident ID
   * @returns {Promise} - Delete response
   */
  deleteIncident: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.INCIDENTS_DELETE(id))
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete incident')
    }
  },
}

export default incidentService
