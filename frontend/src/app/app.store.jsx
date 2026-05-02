import { configureStore } from "@reduxjs/toolkit";
import publicPagesReducer from "../features/public-pages/public-pages.slice";
import dashboardReducer from "../features/dashboard/dashboard.slice";
import authReducer from "../features/auth/auth.slice";
import incidentsReducer from "../features/incidents/incidents.slice";

export const appStore = configureStore({
    reducer: {
        publicPages: publicPagesReducer,
        dashboard: dashboardReducer,
        auth: authReducer,
        incidents: incidentsReducer,
    },
})
