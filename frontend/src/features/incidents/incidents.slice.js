/**
 * Incidents Redux Slice
 * Manages incidents state:
 * - List of incidents
 * - Current incident details
 * - Loading states
 * - Error messages
 * - Filters
 */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  incidents: [],
  currentIncident: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    severity: null,
    page: 1,
    limit: 20,
  },
  total: 0,
}

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    // Fetch incidents
    fetchIncidentsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchIncidentsSuccess: (state, action) => {
      state.loading = false
      state.incidents = action.payload.incidents
      state.total = action.payload.total
      state.error = null
    },
    fetchIncidentsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Fetch single incident
    fetchIncidentStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchIncidentSuccess: (state, action) => {
      state.loading = false
      state.currentIncident = action.payload
      state.error = null
    },
    fetchIncidentFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Create incident
    createIncidentStart: (state) => {
      state.loading = true
      state.error = null
    },
    createIncidentSuccess: (state, action) => {
      state.loading = false
      state.incidents.unshift(action.payload)
      state.error = null
    },
    createIncidentFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Update incident
    updateIncidentStart: (state) => {
      state.loading = true
      state.error = null
    },
    updateIncidentSuccess: (state, action) => {
      state.loading = false
      const index = state.incidents.findIndex((i) => i.id === action.payload.id)
      if (index !== -1) {
        state.incidents[index] = action.payload
      }
      state.currentIncident = action.payload
      state.error = null
    },
    updateIncidentFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Delete incident
    deleteIncidentStart: (state) => {
      state.loading = true
      state.error = null
    },
    deleteIncidentSuccess: (state, action) => {
      state.loading = false
      state.incidents = state.incidents.filter((i) => i.id !== action.payload)
      state.currentIncident = null
      state.error = null
    },
    deleteIncidentFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 }
    },

    // Set page
    setPage: (state, action) => {
      state.filters.page = action.payload
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
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
  setFilters,
  setPage,
  clearError,
} = incidentsSlice.actions

export default incidentsSlice.reducer
