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
      const { token, user } = response.data
      
      // Store token and user
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      
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
      const { token, user } = response.data
      
      // Store token and user
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed')
    }
  },

  /**
   * Logout user
   * Clears tokens from localStorage
   */
  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} - Current user or null
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user has valid token
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken')
  },

  /**
   * Verify token with backend
   * @returns {Promise} - Verification result
   */
  verifyToken: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH_VERIFY)
      return response.data
    } catch (error) {
      return null
    }
  },
}

export default authService
