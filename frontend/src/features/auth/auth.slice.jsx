import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Auth state
  isAuthenticated: false,
  user: null,
  token: null,
  
  // Loading states
  isLoading: false,
  isSendingOTP: false,
  isVerifyingOTP: false,
  
  // OTP flow state
  otpSent: false,
  otpVerified: false,
  otpEmail: '',
  
  // Error handling
  error: null,
  otpAttemptsLeft: 5,
  otpResendCooldown: 0,
  
  // UI state
  showPasswordForm: false,
  authMode: 'login', // 'login' | 'signup'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setSendingOTP: (state, action) => {
      state.isSendingOTP = action.payload;
    },
    
    setVerifyingOTP: (state, action) => {
      state.isVerifyingOTP = action.payload;
    },
    
    // OTP flow
    setOTPSent: (state, action) => {
      state.otpSent = true;
      state.otpEmail = action.payload.email;
      state.error = null;
      state.otpAttemptsLeft = 5;
    },
    
    setOTPVerified: (state, action) => {
      state.otpVerified = true;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    
    resetOTPFlow: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
      state.otpEmail = '';
      state.error = null;
      state.otpAttemptsLeft = 5;
      state.otpResendCooldown = 0;
    },
    
    // Authentication
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    
    setToken: (state, action) => {
      state.token = action.payload;
    },
    
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;
      state.otpSent = false;
      state.otpVerified = false;
    },
    
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.otpEmail = '';
      state.error = null;
    },
    
    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isSendingOTP = false;
      state.isVerifyingOTP = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // OTP specific
    setOTPAttemptsLeft: (state, action) => {
      state.otpAttemptsLeft = action.payload;
    },
    
    setOTPResendCooldown: (state, action) => {
      state.otpResendCooldown = action.payload;
    },
    
    decrementOTPAttempts: (state) => {
      state.otpAttemptsLeft = Math.max(0, state.otpAttemptsLeft - 1);
    },
    
    // UI state
    setAuthMode: (state, action) => {
      state.authMode = action.payload;
    },
    
    setShowPasswordForm: (state, action) => {
      state.showPasswordForm = action.payload;
    },
    
    // Initialize auth from stored token
    initializeAuth: (state, action) => {
      if (action.payload.user && action.payload.token) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setSendingOTP,
  setVerifyingOTP,
  setOTPSent,
  setOTPVerified,
  resetOTPFlow,
  setUser,
  setToken,
  loginSuccess,
  logout,
  setError,
  clearError,
  setOTPAttemptsLeft,
  setOTPResendCooldown,
  decrementOTPAttempts,
  setAuthMode,
  setShowPasswordForm,
  initializeAuth,
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectOTPSent = (state) => state.auth.otpSent;
export const selectOTPVerified = (state) => state.auth.otpVerified;
export const selectAuthError = (state) => state.auth.error;
export const selectOTPAttemptsLeft = (state) => state.auth.otpAttemptsLeft;
export const selectAuthMode = (state) => state.auth.authMode;

// Thunks for async operations - using correct backend API
export const sendOTPThunk = (email, name = '', role = 'employee', avatar = '') => {
  return async (dispatch, getState) => {
    try {
      dispatch(setSendingOTP(true));
      dispatch(clearError());
      
      // Use auth service with proper backend URLs
      const { authService } = await import('./service/auth.service');
      const response = await authService.sendOTP(email, name, role, avatar);
      
      if (response.success) {
        dispatch(setOTPSent({ email }));
        return { success: true, data: response.data };
      } else {
        dispatch(setError(response.error || 'Failed to send OTP'));
        return { success: false, error: response.error };
      }
    } catch (error) {
      dispatch(setError(error.message || 'Failed to send OTP'));
      return { success: false, error: error.message };
    } finally {
      dispatch(setSendingOTP(false));
    }
  };
};

export const verifyOTPThunk = (email, otp) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setVerifyingOTP(true));
      dispatch(clearError());
      
      // Use auth service with proper backend URLs
      const { authService } = await import('./service/auth.service');
      const response = await authService.verifyOTP(email, otp);
      
      if (response.success) {
        dispatch(loginSuccess({
          user: response.user,
          token: response.token,
        }));
        return { success: true, user: response.user };
      } else {
        // Handle backend specific error responses
        if (response.error?.includes('Maximum OTP attempts exceeded')) {
          dispatch(setOTPAttemptsLeft(0));
        } else if (response.error?.includes('attempts left')) {
          const attemptsMatch = response.error.match(/(\d+) attempts? left/);
          if (attemptsMatch) {
            dispatch(setOTPAttemptsLeft(parseInt(attemptsMatch[1])));
          }
        }
        
        dispatch(decrementOTPAttempts());
        dispatch(setError(response.error || 'Invalid OTP'));
        return { success: false, error: response.error };
      }
    } catch (error) {
      dispatch(setError(error.message || 'Invalid OTP'));
      return { success: false, error: error.message };
    } finally {
      dispatch(setVerifyingOTP(false));
    }
  };
};

export const logoutThunk = () => {
  return async (dispatch, getState) => {
    try {
      // Use auth service with proper backend URLs
      const { authService } = await import('./service/auth.service');
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
    }
  };
};

export const checkAuthThunk = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      
      // Use auth service with proper backend URLs
      const { authService } = await import('./service/auth.service');
      const response = await authService.getCurrentUser();
      
      if (response.success && response.data?.user) {
        dispatch(initializeAuth({
          user: response.data.user,
          token: null, // Token is in HttpOnly cookie
        }));
        return { success: true, user: response.data.user };
      } else {
        dispatch(setLoading(false));
        return { success: false };
      }
    } catch (error) {
      dispatch(setLoading(false));
      return { success: false };
    }
  };
};

export default authSlice.reducer;
