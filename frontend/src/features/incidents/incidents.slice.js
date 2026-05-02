/**
 * Incidents Redux Slice
 * Manages incidents state matching backend response format:
 * - Backend returns _id (MongoDB), not id
 * - Backend list returns { incidents: [], total }
 * - Backend detail returns the incident object directly in data
 * - Status enum: open | investigating | identified | resolved
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
    service: null,
    limit: 50,
    skip: 0,
  },
  total: 0,
}

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    // Fetch incidents list
    fetchIncidentsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchIncidentsSuccess: (state, action) => {
      state.loading = false
      // Backend returns { success, data: { incidents, total, ... } }
      // or could return an array directly — handle both
      const payload = action.payload
      if (payload?.data) {
        state.incidents = payload.data.incidents || payload.data || []
        state.total = payload.data.total || state.incidents.length
      } else if (Array.isArray(payload)) {
        state.incidents = payload
        state.total = payload.length
      } else {
        state.incidents = payload?.incidents || []
        state.total = payload?.total || 0
      }
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
      // Backend returns { success, data: incident }
      state.currentIncident = action.payload?.data || action.payload
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
      const newIncident = action.payload?.data || action.payload
      state.incidents.unshift(newIncident)
      state.total += 1
      state.error = null
    },
    createIncidentFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Update incident status
    updateStatusStart: (state) => {
      state.loading = true
      state.error = null
    },
    updateStatusSuccess: (state, action) => {
      state.loading = false
      const updated = action.payload?.data || action.payload
      // Use _id (MongoDB) for matching
      const idx = state.incidents.findIndex(
        (i) => i._id === updated._id
      )
      if (idx !== -1) {
        state.incidents[idx] = { ...state.incidents[idx], ...updated }
      }
      if (state.currentIncident?._id === updated._id) {
        state.currentIncident = { ...state.currentIncident, ...updated }
      }
      state.error = null
    },
    updateStatusFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, skip: 0 }
    },

    // Set pagination
    setPage: (state, action) => {
      state.filters.skip = action.payload * state.filters.limit
    },

    // Clear current incident
    clearCurrentIncident: (state) => {
      state.currentIncident = null
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
  updateStatusStart,
  updateStatusSuccess,
  updateStatusFailure,
  setFilters,
  setPage,
  clearCurrentIncident,
  clearError,
} = incidentsSlice.actions

export default incidentsSlice.reducer
