/**
 * API Configuration
 * Centralized API base URL and endpoints configuration
 * Used for all backend API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_VERIFY: '/auth/verify',
  AUTH_REFRESH: '/auth/refresh',

  // Incidents endpoints
  INCIDENTS_LIST: '/incidents',
  INCIDENTS_CREATE: '/incidents',
  INCIDENTS_DETAIL: (id) => `/incidents/${id}`,
  INCIDENTS_UPDATE: (id) => `/incidents/${id}`,
  INCIDENTS_DELETE: (id) => `/incidents/${id}`,

  // API Keys endpoints
  API_KEYS_LIST: '/api-keys',
  API_KEYS_CREATE: '/api-keys',
  API_KEYS_REVOKE: (id) => `/api-keys/${id}/revoke`,
  API_KEYS_DETAIL: (id) => `/api-keys/${id}`,

  // Dashboard endpoints
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_INCIDENTS: '/dashboard/incidents',

  // Health check
  HEALTH_CHECK: '/health',
}

export default API_BASE_URL
