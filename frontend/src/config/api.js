/**
 * API Configuration
 * Centralized API base URL and endpoints configuration
 * All endpoints match the backend routes exactly
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const API_ENDPOINTS = {
  // Auth endpoints (OTP-based — no password)
  AUTH_SEND_OTP: '/auth/send-otp',
  AUTH_VERIFY_OTP: '/auth/verify-otp',
  AUTH_ME: '/auth/me',
  AUTH_LOGOUT: '/auth/logout',

  // Incidents endpoints
  INCIDENTS_LIST: '/incidents',
  INCIDENTS_CREATE: '/incidents',
  INCIDENTS_DETAIL: (id) => `/incidents/${id}`,
  INCIDENTS_UPDATE_STATUS: (id) => `/incidents/${id}/status`,
  INCIDENTS_ASSIGN: (id) => `/incidents/${id}/assign`,
  INCIDENTS_DASHBOARD_STATS: '/incidents/dashboard/stats',

  // Dashboard endpoints
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_TRENDS: '/dashboard/trends',

  // API Keys endpoints (backend uses /api/keys)
  API_KEYS_LIST: '/keys',
  API_KEYS_CREATE: '/keys',
  API_KEYS_REVOKE: (id) => `/keys/${id}`,

  // Health endpoints
  HEALTH_LIST: '/health',
  HEALTH_SERVICE: (service) => `/health/${service}`,
  HEALTH_REPORT: '/health/report',

  // Errors endpoints
  ERRORS_RECENT: '/errors/recent',
  ERRORS_DETAIL: (id) => `/errors/${id}`,

  // Organization endpoints
  ORG_DETAIL: (id) => `/organizations/${id}`,
  ORG_UPDATE: (id) => `/organizations/${id}`,

  // Profile endpoints
  PROFILE: '/profile',
  PROFILE_UPDATE: '/profile',
  PROFILE_CREATE_ORG: '/profile/organization',
  MEMBERS_LIST: '/profile/members',
  MEMBERS_ADD: '/profile/members',
  MEMBERS_REMOVE: (id) => `/profile/members/${id}`,
  MEMBERS_UPDATE_ROLE: (id) => `/profile/members/${id}/role`,
}

export default API_BASE_URL
