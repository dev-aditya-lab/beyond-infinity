/**
 * Authentication Service
 * Handles all auth-related API calls with OTP-based authentication:
 * - Send OTP to email (login/signup)
 * - Verify OTP and complete authentication
 * - Token management
 */

import apiClient from './apiClient.js'
import { API_ENDPOINTS } from '../config/api.js'

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'authToken',
  LEGACY_TOKEN: 'token',
  USER: 'user',
  PENDING_EMAIL: 'pendingEmail', // Email awaiting OTP verification
}

const getStoredValue = (key) => {
  return localStorage.getItem(key) || sessionStorage.getItem(key)
}

export const authService = {
  /**
   * Send OTP to user's email
   * Creates user account if it doesn't exist (for signup flow)
   * @param {string} email - User email
   * @param {string} name - User name (optional, for signup)
   * @returns {Promise} - Success response with email
   */
  sendOTP: async (email, name = '') => {
    try {
      const payload = { email }
      if (name) payload.name = name
      
      const response = await apiClient.post(API_ENDPOINTS.AUTH_SEND_OTP, payload)
      
      // Store pending email for OTP verification step
      localStorage.setItem(STORAGE_KEYS.PENDING_EMAIL, email)
      
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP', {
        cause: error,
      })
    }
  },

  /**
   * Verify OTP and complete login/signup
   * @param {string} email - User email
   * @param {string} otp - 6-digit OTP code
   * @returns {Promise} - User data and token
   */
  verifyOTP: async (email, otp) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH_VERIFY_OTP, {
        email,
        otp,
      })
      
      // Extract token and user from response
      const { token, user } = response.data.data

      if (!token || !user) {
        throw new Error('Invalid auth response from server')
      }
      
      // Store token and user
      authService.persistToken(token, user)
      
      // Clear pending email
      localStorage.removeItem(STORAGE_KEYS.PENDING_EMAIL)
      
      return { token, user }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP verification failed', {
        cause: error,
      })
    }
  },

  /**
   * Persist token and user data to localStorage
   * @param {string} token - Authentication token
   * @param {Object} user - User data
   */
  persistToken: (token, user) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    // Keep legacy key for compatibility with any existing code paths.
    localStorage.setItem(STORAGE_KEYS.LEGACY_TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))

    sessionStorage.setItem(STORAGE_KEYS.TOKEN, token)
    sessionStorage.setItem(STORAGE_KEYS.LEGACY_TOKEN, token)
    sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  /**
   * Logout user - clears tokens from localStorage
   */
  logout: async () => {
    try {
      // Optional: notify backend of logout
      await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT)
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.LEGACY_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.PENDING_EMAIL)

      sessionStorage.removeItem(STORAGE_KEYS.TOKEN)
      sessionStorage.removeItem(STORAGE_KEYS.LEGACY_TOKEN)
      sessionStorage.removeItem(STORAGE_KEYS.USER)
      sessionStorage.removeItem(STORAGE_KEYS.PENDING_EMAIL)
    }
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} - Current user or null
   */
  getCurrentUser: () => {
    const user = getStoredValue(STORAGE_KEYS.USER)
    return user ? JSON.parse(user) : null
  },

  /**
   * Get pending email (email awaiting OTP verification)
   * @returns {string|null} - Pending email or null
   */
  getPendingEmail: () => {
    return getStoredValue(STORAGE_KEYS.PENDING_EMAIL)
  },

  /**
   * Get authentication token
   * @returns {string|null} - Token or null
   */
  getToken: () => {
    return (
      localStorage.getItem(STORAGE_KEYS.TOKEN) ||
      localStorage.getItem(STORAGE_KEYS.LEGACY_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.LEGACY_TOKEN)
    )
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user has valid token and user data
   */
  isAuthenticated: () => {
    const token = authService.getToken()
    const user = getStoredValue(STORAGE_KEYS.USER)
    return !!(token && user)
  },

  /**
   * Get current user with authentication check
   * @returns {Promise} - User data from backend
   */
  getCurrentUserFromBackend: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH_ME)
      const user = response.data.data
      
      // Update stored user
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
      
      return user
    } catch (error) {
      authService.logout()
      throw new Error(error.response?.data?.message || 'Failed to fetch user', {
        cause: error,
      })
    }
  },
}

export default authService
