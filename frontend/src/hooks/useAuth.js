/**
 * useAuth Hook
 * Provides easy access to auth state and OTP-based authentication
 * Usage: const { user, isAuthenticated, sendOTP, verifyOTP, logout } = useAuth()
 */

import { useDispatch, useSelector } from 'react-redux'
import authService from '../services/auth.service.js'
import {
  loginStart,
  otpSentSuccess,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  setUser,
  clearError,
} from '../features/auth/auth.slice.js'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error, otpSent, pendingEmail } = useSelector(
    (state) => state.auth
  )

  /**
   * Send OTP to email (for login or signup)
   * Backend: POST /auth/send-otp { email, name? }
   * @param {string} email - User email
   * @param {string} name - User name (optional, for signup)
   * @returns {Promise} - Response with email
   */
  const sendOTP = async (email, name = '') => {
    dispatch(loginStart())
    try {
      const response = await authService.sendOTP(email, name)
      dispatch(otpSentSuccess({ email }))
      // Don't dispatch loginSuccess — user needs to verify OTP first
      return response
    } catch (err) {
      dispatch(loginFailure(err.message))
      throw err
    }
  }

  /**
   * Verify OTP and complete authentication
   * Backend: POST /auth/verify-otp { email, otp }
   * @param {string} email - User email
   * @param {string} otp - 6-digit OTP code
   * @returns {Promise} - Response with user and token
   */
  const verifyOTP = async (email, otp) => {
    dispatch(loginStart())
    try {
      const response = await authService.verifyOTP(email, otp)
      // Dispatch success with user data from backend
      dispatch(loginSuccess(response))
      return response
    } catch (err) {
      dispatch(loginFailure(err.message))
      throw err
    }
  }

  /**
   * Logout user
   * Backend: POST /auth/logout (clears httpOnly cookie)
   */
  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.warn('Logout error:', err)
    } finally {
      dispatch(logoutAction())
    }
  }

  /**
   * Fetch current user from backend
   * Backend: GET /auth/me
   * Used to re-validate session on app load
   */
  const fetchCurrentUser = async () => {
    try {
      const userData = await authService.getCurrentUserFromBackend()
      dispatch(setUser(userData))
      return userData
    } catch (err) {
      dispatch(logoutAction())
      throw err
    }
  }

  /**
   * Clear error message
   */
  const clearAuthError = () => {
    dispatch(clearError())
  }

  /**
   * Get pending email (email awaiting OTP verification)
   */
  const getPendingEmail = () => {
    return authService.getPendingEmail()
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    otpSent,
    pendingEmail,
    sendOTP,
    verifyOTP,
    logout,
    fetchCurrentUser,
    clearAuthError,
    getPendingEmail,
  }
}

export default useAuth
