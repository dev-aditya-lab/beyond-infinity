/**
 * Authentication Service
 * Handles all auth-related API calls:
 * - Login
 * - Signup
 * - Token management
 * - User verification
 */

import apiClient from './apiClient.js'
import { API_ENDPOINTS } from '../config/api.js'

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'authToken',
  USER: 'user',
  EXPIRY: 'tokenExpiry',
}

export const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - User data and token
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH_LOGIN, {
        email,
        password,
      })
      const { token, user, expiresIn } = response.data
      
      // Store token and user with expiration
      authService.persistToken(token, user, expiresIn)
      
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name
   * @returns {Promise} - User data and token
   */
  signup: async (email, password, name) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH_SIGNUP, {
        email,
        password,
        name,
      })
      const { token, user, expiresIn } = response.data
      
      // Store token and user with expiration
      authService.persistToken(token, user, expiresIn)
      
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed')
    }
  },

  /**
   * Persist token and user data to localStorage
   * @param {string} token - Authentication token
   * @param {Object} user - User data
   * @param {number} expiresIn - Expiration time in seconds
   */
  persistToken: (token, user, expiresIn = 86400) => {
    const expiryTime = Date.now() + expiresIn * 1000
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    localStorage.setItem(STORAGE_KEYS.EXPIRY, expiryTime.toString())
  },

  /**
   * Logout user
   * Clears tokens from localStorage
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.EXPIRY)
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} - Current user or null
   */
  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER)
    return user ? JSON.parse(user) : null
  },

  /**
   * Get authentication token
   * @returns {string|null} - Token or null
   */
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  },

  /**
   * Check if token is expired
   * @returns {boolean} - True if token is expired
   */
  isTokenExpired: () => {
    const expiry = localStorage.getItem(STORAGE_KEYS.EXPIRY)
    if (!expiry) return true
    return Date.now() > parseInt(expiry)
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user has valid token
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (!token) return false
    if (authService.isTokenExpired()) {
      authService.logout()
      return false
    }
    return true
  },

  /**
   * Verify token with backend
   * @returns {Promise} - Verification result
   */
  verifyToken: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH_VERIFY)
      const { token, user, expiresIn } = response.data
      // Refresh token if still valid
      if (token) {
        authService.persistToken(token, user, expiresIn)
      }
      return response.data
    } catch (error) {
      authService.logout()
      return null
    }
  },

  /**
   * Refresh authentication token
   * @returns {Promise} - New token data
   */
  refreshToken: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH_REFRESH)
      const { token, user, expiresIn } = response.data
      authService.persistToken(token, user, expiresIn)
      return response.data
    } catch (error) {
      authService.logout()
      throw error
    }
  },
}

export default authService
