/**
 * Dashboard Redux Slice
 * Manages dashboard state:
 * - Active view (sidebar navigation)
 * - Dashboard stats from backend
 * - All data is fetched from APIs — no mock data
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeView: "dashboard",
  stats: null,        // Dashboard stats from backend
  trends: null,       // Trend data from backend
  health: [],         // Service health data
  statsLoading: false,
  statsError: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },

    // Dashboard stats
    setStatsLoading: (state, action) => {
      state.statsLoading = action.payload;
    },
    setStats: (state, action) => {
      state.stats = action.payload;
      state.statsLoading = false;
      state.statsError = null;
    },
    setStatsError: (state, action) => {
      state.statsError = action.payload;
      state.statsLoading = false;
    },

    // Trends
    setTrends: (state, action) => {
      state.trends = action.payload;
    },

    // Health
    setHealth: (state, action) => {
      state.health = action.payload;
    },
  },
});

export const {
  setActiveView,
  setStatsLoading,
  setStats,
  setStatsError,
  setTrends,
  setHealth,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
