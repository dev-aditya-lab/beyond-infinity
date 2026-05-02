/**
 * API Client
 * Axios instance with interceptors for:
 * - Token injection in headers
 * - Cookie-based auth support (withCredentials)
 * - Error handling
 * - Response transformation
 */

import axios from 'axios'
import API_BASE_URL from '../config/api.js'

const getStoredToken = () => {
  return (
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('token')
  )
}

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with every request (backend uses httpOnly cookies)
  timeout: 15000,
})

/**
 * Request interceptor
 * Adds authentication token to every request
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get fresh token from storage for every request.
    const token = getStoredToken()
    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor
 * Handles errors and auto-logout on 401
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentToken = getStoredToken()

      // Only tear down auth state when there is no token left to retry with.
      // This avoids boot loops when the first protected request races auth hydration.
      if (!currentToken) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('pendingEmail')

        sessionStorage.removeItem('authToken')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('pendingEmail')

        if (
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/signup' &&
          window.location.pathname !== '/'
        ) {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
