// Auth Components
export { default as AuthPage } from './pages/AuthPage';
export { default as AuthForm } from './components/AuthForm';
export { default as OTPInput } from './components/OTPInput';
export { default as ProtectedRoute } from './components/ProtectedRoute';

// Auth Context & Hooks
export { AuthProvider, useAuth } from './context/AuthContext';
export { 
  useAuthActions, 
  useAuthState, 
  useUser, 
  useAuthLoading, 
  useAuthError, 
  useOTPState 
} from './hooks/useAuth';

// Auth Service
export { authService } from './service/auth.service';
export { default as AuthService } from './service/auth.service';
