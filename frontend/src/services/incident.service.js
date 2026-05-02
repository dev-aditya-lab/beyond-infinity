/**
 * Incident Service
 * Handles all incident-related API calls matching backend routes:
 * - POST   /api/incidents           → Create incident
 * - GET    /api/incidents           → List incidents (with filters)
 * - GET    /api/incidents/:id       → Get incident detail
 * - PUT    /api/incidents/:id/status → Update incident status
 * - POST   /api/incidents/:id/assign → Assign incident
 * - GET    /api/incidents/dashboard/stats → Dashboard stats
 */

import apiClient from './apiClient.js'
import { API_ENDPOINTS } from '../config/api.js'

export const incidentService = {
  /**
   * Fetch all incidents with optional filters
   * Backend supports: limit, skip, status, severity, service, tags
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - { success, data: { incidents, total, ... } }
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
   * @param {string} id - MongoDB ObjectId
   * @returns {Promise} - { success, data: incident }
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
   * Create new incident (manual)
   * Backend requires: title, service, severity
   * Backend optional: description, tags
   * @param {Object} data - { title, description, service, severity, tags }
   * @returns {Promise} - { success, data: incident }
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
   * Update incident status
   * Backend expects: { status } in body where status is one of:
   * 'open' | 'investigating' | 'identified' | 'resolved'
   * @param {string} id - Incident ID
   * @param {string} status - New status value
   * @returns {Promise} - { success, data: updatedIncident }
   */
  updateIncidentStatus: async (id, status) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.INCIDENTS_UPDATE_STATUS(id),
        { status }
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update incident status')
    }
  },

  /**
   * Assign incident to responders
   * @param {string} id - Incident ID
   * @param {Object} data - { autoAssign: true } or { userIds: [...] }
   * @returns {Promise} - { success, data }
   */
  assignIncident: async (id, data) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.INCIDENTS_ASSIGN(id),
        data
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to assign incident')
    }
  },

  /**
   * Get incident dashboard stats
   * @returns {Promise} - { success, data: stats }
   */
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.INCIDENTS_DASHBOARD_STATS)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats')
    }
  },
}

export default incidentService
