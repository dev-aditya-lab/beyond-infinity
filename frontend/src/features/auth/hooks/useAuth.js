import { useAuth } from '../context/AuthContext';

// Custom hook for authentication operations
export const useAuthActions = () => {
  const { sendOTP, verifyOTP, logout, clearError, resetOTPState } = useAuth();
  
  return {
    sendOTP,
    verifyOTP,
    logout,
    clearError,
    resetOTPState,
  };
};

// Custom hook for authentication state
export const useAuthState = () => {
  const { user, isLoading, isAuthenticated, error, otpSent, otpVerified } = useAuth();
  
  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    otpSent,
    otpVerified,
  };
};

// Custom hook for user info
export const useUser = () => {
  const { user, isAuthenticated } = useAuth();
  
  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
    userName: user?.name || '',
    userEmail: user?.email || '',
    userAvatar: user?.avatar || '',
    userId: user?._id || '',
  };
};

// Custom hook for loading states
export const useAuthLoading = () => {
  const { isLoading } = useAuth();
  
  return isLoading;
};

// Custom hook for error handling
export const useAuthError = () => {
  const { error, clearError } = useAuth();
  
  return {
    error,
    clearError,
    hasError: !!error,
  };
};

// Custom hook for OTP state
export const useOTPState = () => {
  const { otpSent, otpVerified, resetOTPState } = useAuth();
  
  return {
    otpSent,
    otpVerified,
    resetOTPState,
    isOTPFlow: otpSent || otpVerified,
  };
};

export default useAuth;
