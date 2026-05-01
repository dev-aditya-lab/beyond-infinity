import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_KEYS } from "./dashboard.constants";

const initialState = {
  activeView: "dashboard",
  apiKeys: INITIAL_KEYS,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
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

export const { setActiveView, addApiKey, revokeApiKey, toggleKeyVisibility } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
