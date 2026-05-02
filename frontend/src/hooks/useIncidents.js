/**
 * useIncidents Hook
 * Provides easy access to incidents state and operations
 * Matches backend API structure (status updates, assignments)
 * Usage: const { incidents, loading, getIncidents, createIncident } = useIncidents()
 */

import { useDispatch, useSelector } from 'react-redux'
import incidentService from '../services/incident.service.js'
import {
  fetchIncidentsStart,
  fetchIncidentsSuccess,
  fetchIncidentsFailure,
  fetchIncidentStart,
  fetchIncidentSuccess,
  fetchIncidentFailure,
  createIncidentStart,
  createIncidentSuccess,
  createIncidentFailure,
  updateStatusStart,
  updateStatusSuccess,
  updateStatusFailure,
  setFilters as setFiltersAction,
  setPage as setPageAction,
  clearCurrentIncident,
  clearError,
} from '../features/incidents/incidents.slice.js'

export const useIncidents = () => {
  const dispatch = useDispatch()
  const {
    incidents,
    currentIncident,
    loading,
    error,
    filters,
    total,
  } = useSelector((state) => state.incidents)

  /**
   * Fetch all incidents with optional filters
   * Backend supports: limit, skip, status, severity, service, tags
   */
  const getIncidents = async (filterParams = {}) => {
    dispatch(fetchIncidentsStart())
    try {
      const response = await incidentService.getIncidents(filterParams)
      dispatch(fetchIncidentsSuccess(response))
      return response
    } catch (err) {
      dispatch(fetchIncidentsFailure(err.message))
      throw err
    }
  }

  /**
   * Get single incident by ID (MongoDB _id)
   */
  const getIncidentById = async (id) => {
    dispatch(fetchIncidentStart())
    try {
      const response = await incidentService.getIncidentById(id)
      dispatch(fetchIncidentSuccess(response))
      return response
    } catch (err) {
      dispatch(fetchIncidentFailure(err.message))
      throw err
    }
  }

  /**
   * Create new incident
   * Backend requires: title, service, severity
   * Optional: description, tags
   */
  const createIncident = async (data) => {
    dispatch(createIncidentStart())
    try {
      const response = await incidentService.createIncident(data)
      dispatch(createIncidentSuccess(response))
      return response
    } catch (err) {
      dispatch(createIncidentFailure(err.message))
      throw err
    }
  }

  /**
   * Update incident status
   * Backend uses PUT /incidents/:id/status with { status }
   * Valid values: open, investigating, identified, resolved
   */
  const updateIncidentStatus = async (id, status) => {
    dispatch(updateStatusStart())
    try {
      const response = await incidentService.updateIncidentStatus(id, status)
      dispatch(updateStatusSuccess(response))
      return response
    } catch (err) {
      dispatch(updateStatusFailure(err.message))
      throw err
    }
  }

  /**
   * Assign incident to responders
   */
  const assignIncident = async (id, data) => {
    try {
      const response = await incidentService.assignIncident(id, data)
      return response
    } catch (err) {
      throw err
    }
  }

  /**
   * Set filters and reset pagination
   */
  const setFilters = (newFilters) => {
    dispatch(setFiltersAction(newFilters))
  }

  /**
   * Set page for pagination
   */
  const setPage = (page) => {
    dispatch(setPageAction(page))
  }

  /**
   * Clear current incident detail
   */
  const clearIncident = () => {
    dispatch(clearCurrentIncident())
  }

  /**
   * Clear error message
   */
  const clearIncidentError = () => {
    dispatch(clearError())
  }

  return {
    incidents,
    currentIncident,
    loading,
    error,
    filters,
    total,
    getIncidents,
    getIncidentById,
    createIncident,
    updateIncidentStatus,
    assignIncident,
    setFilters,
    setPage,
    clearIncident,
    clearIncidentError,
  }
}

export default useIncidents
