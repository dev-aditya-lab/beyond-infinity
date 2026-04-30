import { configureStore } from "@reduxjs/toolkit";
import publicPagesReducer from "../features/public-pages/public-pages.slice";

export const appStore = configureStore({
    reducer: {
        publicPages: publicPagesReducer,
    },
})
