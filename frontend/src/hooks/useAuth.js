/**
 * useAuth Hook
 * Provides easy access to auth state and methods
 * Usage: const { user, isAuthenticated, login, logout } = useAuth()
 */

import { useDispatch, useSelector } from 'react-redux'
import authService from '../services/auth.service.js'
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout as logoutAction,
  clearError,
} from '../features/auth/auth.slice.js'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  )

  /**
   * Login user
   */
  const login = async (email, password) => {
    dispatch(loginStart())
    try {
      const response = await authService.login(email, password)
      dispatch(loginSuccess(response))
      return response
    } catch (err) {
      dispatch(loginFailure(err.message))
      throw err
    }
  }

  /**
   * Signup new user
   */
  const signup = async (email, password, name) => {
    dispatch(signupStart())
    try {
      const response = await authService.signup(email, password, name)
      dispatch(signupSuccess(response))
      return response
    } catch (err) {
      dispatch(signupFailure(err.message))
      throw err
    }
  }

  /**
   * Logout user
   */
  const logout = () => {
    authService.logout()
    dispatch(logoutAction())
  }

  /**
   * Clear error message
   */
  const clearAuthError = () => {
    dispatch(clearError())
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
    clearAuthError,
  }
}

export default useAuth
