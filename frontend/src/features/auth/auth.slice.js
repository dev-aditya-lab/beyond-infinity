/**
 * Auth Redux Slice
 * Manages OTP-based authentication state:
 * - User data (from backend /auth/me or /auth/verify-otp)
 * - Loading states for OTP send/verify
 * - Error messages
 * - Authentication status
 * - OTP flow step tracking
 */

import { createSlice } from '@reduxjs/toolkit'
import authService from '../../services/auth.service.js'

const initialState = {
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,
  otpSent: false,       // Whether OTP has been sent (step 2 of auth flow)
  pendingEmail: null,    // Email awaiting OTP verification
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // OTP Send / Login start
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },

    // OTP sent successfully — move to verification step
    otpSentSuccess: (state, action) => {
      state.loading = false
      state.otpSent = true
      state.pendingEmail = action.payload?.email || null
      state.error = null
    },

    // OTP verified and user authenticated
    loginSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.isAuthenticated = true
      state.otpSent = false
      state.pendingEmail = null
      state.error = null
    },

    // Auth failure (OTP send or verify)
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Logout — clear everything
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      state.otpSent = false
      state.pendingEmail = null
    },

    // Update user data (from /auth/me)
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  loginStart,
  otpSentSuccess,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  clearError,
} = authSlice.actions

export default authSlice.reducer
