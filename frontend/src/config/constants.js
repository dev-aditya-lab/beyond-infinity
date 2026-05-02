/**
 * Application Constants
 * Centralized enums and constants matching backend values
 */

// Incident severity levels (match backend incident.model.js)
export const SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
}

export const SEVERITY_OPTIONS = Object.values(SEVERITY)

// Incident status values (match backend incident.model.js)
export const STATUS = {
  OPEN: 'open',
  INVESTIGATING: 'investigating',
  IDENTIFIED: 'identified',
  RESOLVED: 'resolved',
}

export const STATUS_OPTIONS = Object.values(STATUS)

// Incident source values (match backend incident.model.js)
export const SOURCE = {
  MANUAL: 'manual',
  API: 'api',
  MONITORING: 'monitoring',
  AI: 'ai',
}

// User roles (match backend user.model.js)
export const ROLES = {
  ADMIN: 'admin',
  RESPONDER: 'responder',
  EMPLOYEE: 'employee',
}

// Service health statuses
export const HEALTH_STATUS = {
  UP: 'up',
  DOWN: 'down',
  DEGRADED: 'degraded',
}

// Severity badge color mapping (OpsPulse theme)
export const SEVERITY_COLORS = {
  [SEVERITY.CRITICAL]: {
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.25)',
    text: '#ef4444',
    label: 'CRITICAL',
  },
  [SEVERITY.HIGH]: {
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.25)',
    text: '#f97316',
    label: 'HIGH',
  },
  [SEVERITY.MEDIUM]: {
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    text: '#f59e0b',
    label: 'MEDIUM',
  },
  [SEVERITY.LOW]: {
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.25)',
    text: '#3b82f6',
    label: 'LOW',
  },
}

// Status badge color mapping (OpsPulse theme)
export const STATUS_COLORS = {
  [STATUS.OPEN]: {
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.25)',
    text: '#ef4444',
    label: 'OPEN',
  },
  [STATUS.INVESTIGATING]: {
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    text: '#f59e0b',
    label: 'INVESTIGATING',
  },
  [STATUS.IDENTIFIED]: {
    bg: 'rgba(129,140,248,0.12)',
    border: 'rgba(129,140,248,0.25)',
    text: '#818cf8',
    label: 'IDENTIFIED',
  },
  [STATUS.RESOLVED]: {
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.25)',
    text: '#22c55e',
    label: 'RESOLVED',
  },
}

// Health status badge colors
export const HEALTH_COLORS = {
  [HEALTH_STATUS.UP]: {
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.25)',
    text: '#22c55e',
    label: 'UP',
  },
  [HEALTH_STATUS.DOWN]: {
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.25)',
    text: '#ef4444',
    label: 'DOWN',
  },
  [HEALTH_STATUS.DEGRADED]: {
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    text: '#f59e0b',
    label: 'DEGRADED',
  },
}
