import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectIsAuthenticated, 
  selectAuthLoading, 
  checkAuthThunk,
  logout as logoutAction
} from '../auth.slice';
import AuthForm from '../components/AuthForm';

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  // Check authentication on mount and redirect if authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(checkAuthThunk()).unwrap();
      } catch (error) {
        // User is not authenticated, stay on auth page
      }
    };

    checkAuth();
  }, [dispatch]);

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-offwhite/20 border-t-brand-offwhite rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-offwhite/60 font-barlow">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render auth form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="scanlines" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-offwhite/5 via-transparent to-brand-offwhite/10" />
      </div>

      {/* Auth Container */}
      <div className="relative z-10 w-full max-w-lg">
        
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bebas text-brand-offwhite tracking-wider mb-2">
            OPS PULSE
          </h1>
          <p className="text-brand-offwhite/60 font-barlow text-sm">
            Incident Response System
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white/[0.02] border border-brand-offwhite/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <AuthForm useRedux={true} />
        </div>

        {/* App Features */}
        <div className="mt-6 bg-white/[0.02] border border-brand-offwhite/10 rounded-lg p-4">
          <p className="text-brand-offwhite/40 text-xs font-barlow text-center mb-2">
            OpsPulse Features:
          </p>
          <ul className="text-brand-offwhite/30 text-xs font-barlow space-y-1">
            <li>• Real-time incident monitoring</li>
            <li>• Automated alert system</li>
            <li>• Team collaboration tools</li>
            <li>• Performance analytics</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-brand-offwhite/30 font-barlow text-xs">
            © 2026 OpsPulse. All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
