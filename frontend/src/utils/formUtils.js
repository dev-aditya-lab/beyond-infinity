/**
 * Form Utilities
 * Helper functions for form validation and manipulation
 */

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Validate password strength
 * Returns object with score (0-4) and feedback
 */
export const validatePassword = (password) => {
  let score = 0
  const feedback = []

  if (password.length >= 8) score++
  else feedback.push('At least 8 characters')

  if (/[a-z]/.test(password)) score++
  else feedback.push('One lowercase letter')

  if (/[A-Z]/.test(password)) score++
  else feedback.push('One uppercase letter')

  if (/[0-9]/.test(password)) score++
  else feedback.push('One number')

  return { score, feedback }
}

/**
 * Sanitize form data - remove empty strings and trim
 */
export const sanitizeFormData = (data) => {
  const sanitized = {}
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      sanitized[key] = value.trim()
    } else if (value !== null && value !== undefined) {
      sanitized[key] = value
    }
  })
  return sanitized
}

/**
 * Get form error message
 */
export const getFormErrorMessage = (fieldName, error) => {
  const errorMessages = {
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters',
    name: 'Name is required',
    required: `${fieldName} is required`,
  }
  return errorMessages[error] || error
}

export default {
  validateEmail,
  validatePassword,
  sanitizeFormData,
  getFormErrorMessage,
}
