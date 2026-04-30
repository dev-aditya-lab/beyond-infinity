import { configureStore } from "@reduxjs/toolkit";
import publicPagesReducer from "../features/public-pages/public-pages.slice";
import dashboardReducer from "../features/dashboard/dashboard.slice";

export const appStore = configureStore({
    reducer: {
        publicPages: publicPagesReducer,
        dashboard: dashboardReducer,
    },
})
