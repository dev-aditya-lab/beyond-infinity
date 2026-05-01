/**
 * Environment Configuration
 * Centralized access to environment variables
 */

export const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'OpsPulse',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Environment
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  
  // Debug
  debug: import.meta.env.DEV,
}

export default env
