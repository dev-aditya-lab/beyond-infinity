import { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../service/auth.service';

// Auth state initial value
const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  otpSent: false,
  otpVerified: false,
};

// Auth action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  OTP_SENT: 'OTP_SENT',
  OTP_VERIFIED: 'OTP_VERIFIED',
  LOGOUT: 'LOGOUT',
  RESET_OTP_STATE: 'RESET_OTP_STATE',
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        otpSent: false,
        otpVerified: false,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.OTP_SENT:
      return {
        ...state,
        otpSent: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.OTP_VERIFIED:
      return {
        ...state,
        otpVerified: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        otpSent: false,
        otpVerified: false,
      };

    case AUTH_ACTIONS.RESET_OTP_STATE:
      return {
        ...state,
        otpSent: false,
        otpVerified: false,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        const response = await authService.getCurrentUser();
        
        if (response.success && response.data?.user) {
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        // User is not authenticated
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Send OTP (works for both login and signup)
  const sendOTP = async (email, name = '', role = 'employee', avatar = '') => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authService.sendOTP(email, name, role, avatar);
      
      if (response.success) {
        dispatch({ type: AUTH_ACTIONS.OTP_SENT });
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to send OTP';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Verify OTP and login
  const verifyOTP = async (email, otp) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authService.verifyOTP(email, otp);
      
      if (response.success && response.data?.user) {
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.message || 'Invalid OTP');
      }
    } catch (error) {
      const errorMessage = error.message || 'Invalid OTP';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Reset OTP state (for going back to email input)
  const resetOTPState = () => {
    dispatch({ type: AUTH_ACTIONS.RESET_OTP_STATE });
  };

  const value = {
    ...state,
    sendOTP,
    verifyOTP,
    logout,
    clearError,
    resetOTPState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
