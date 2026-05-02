/**
 * Dashboard Redux Slice
 * Manages dashboard state:
 * - Active view (sidebar navigation)
 * - Dashboard stats from backend
 * - API keys (local state for UI)
 */

import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_KEYS } from "./dashboard.constants";

const initialState = {
  activeView: "dashboard",
  apiKeys: INITIAL_KEYS,
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

    // API Keys (local state)
    addApiKey: (state, action) => {
      state.apiKeys.unshift(action.payload);
    },
    revokeApiKey: (state, action) => {
      const key = state.apiKeys.find((k) => k.id === action.payload);
      if (key) {
        key.active = false;
        key.visible = false;
      }
    },
    toggleKeyVisibility: (state, action) => {
      const key = state.apiKeys.find((k) => k.id === action.payload);
      if (key && key.active) {
        key.visible = !key.visible;
      }
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
  addApiKey,
  revokeApiKey,
  toggleKeyVisibility,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
