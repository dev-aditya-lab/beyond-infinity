import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../hooks/useAuth';

const ProtectedRoute = ({ children, redirectTo = '/auth' }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthState();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-offwhite/20 border-t-brand-offwhite rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-offwhite/60 font-barlow">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
