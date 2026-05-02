/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * - Redirects to /login if not authenticated
 * - Redirects to /onboarding if authenticated but no organization
 */

import { Navigate } from 'react-router'
import { useSelector } from 'react-redux'

export const ProtectedRoute = ({ children, skipOrgCheck = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Redirect to onboarding if user has no organization (unless skipOrgCheck)
  if (!skipOrgCheck && !user?.organizationId) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

export default ProtectedRoute
