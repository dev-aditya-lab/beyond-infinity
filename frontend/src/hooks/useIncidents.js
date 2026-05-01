/**
 * useIncidents Hook
 * Provides easy access to incidents state and operations
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
  updateIncidentStart,
  updateIncidentSuccess,
  updateIncidentFailure,
  deleteIncidentStart,
  deleteIncidentSuccess,
  deleteIncidentFailure,
  setFilters as setFiltersAction,
  setPage as setPageAction,
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
   * Get single incident by ID
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
   * Update incident
   */
  const updateIncident = async (id, data) => {
    dispatch(updateIncidentStart())
    try {
      const response = await incidentService.updateIncident(id, data)
      dispatch(updateIncidentSuccess(response))
      return response
    } catch (err) {
      dispatch(updateIncidentFailure(err.message))
      throw err
    }
  }

  /**
   * Delete incident
   */
  const deleteIncident = async (id) => {
    dispatch(deleteIncidentStart())
    try {
      const response = await incidentService.deleteIncident(id)
      dispatch(deleteIncidentSuccess(id))
      return response
    } catch (err) {
      dispatch(deleteIncidentFailure(err.message))
      throw err
    }
  }

  /**
   * Set filters
   */
  const setFilters = (newFilters) => {
    dispatch(setFiltersAction(newFilters))
  }

  /**
   * Set page
   */
  const setPage = (page) => {
    dispatch(setPageAction(page))
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
    updateIncident,
    deleteIncident,
    setFilters,
    setPage,
    clearIncidentError,
  }
}

export default useIncidents
