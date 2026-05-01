import { useState } from 'react';
import { Mail, User, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuthActions, useAuthState, useAuthError, useOTPState } from '../hooks/useAuth';
import OTPInput from './OTPInput';
import { useDispatch, useSelector } from 'react-redux';
import { sendOTPThunk, verifyOTPThunk, resetOTPFlow, clearError } from '../auth.slice';

const AuthForm = ({ useRedux = false }) => {
  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('employee');
  const [avatar, setAvatar] = useState('');
  const [otp, setOTP] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  // Use either Redux or Context based on prop
  if (useRedux) {
    // Redux hooks
    const dispatch = useDispatch();
    const { isLoading, otpSent, otpVerified, error, otpAttemptsLeft } = useSelector((state) => state.auth);
    
    // Determine if it's a new user based on whether name is provided
    const handleEmailSubmit = async (e) => {
      e.preventDefault();
      
      if (!email.trim()) {
        return;
      }

      try {
        const result = await dispatch(sendOTPThunk(email, name, role, avatar)).unwrap();
        
        if (result.success) {
          setIsNewUser(!!name.trim());
        }
      } catch (error) {
        console.error('Send OTP error:', error);
      }
    };

    const handleOTPVerify = async (otpValue) => {
      try {
        const result = await dispatch(verifyOTPThunk(email, otpValue)).unwrap();
        
        if (result.success) {
          // Navigation will be handled by auth page
        }
      } catch (error) {
        console.error('Verify OTP error:', error);
      }
    };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) clearError();
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) clearError();
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canSubmitEmail = email.trim() && isValidEmail(email) && !isLoading;
  const isEmailStep = !otpSent && !otpVerified;
  const isOTPFlow = otpSent || otpVerified;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-offwhite/10 border border-brand-offwhite/20 rounded-full mb-4">
          <Mail className="w-8 h-8 text-brand-offwhite" />
        </div>
        <h1 className="text-2xl font-bebas text-brand-offwhite mb-2">
          {isEmailStep ? 'Welcome to Ops Pulse' : 'Enter OTP'}
        </h1>
        <p className="text-brand-offwhite/60 text-sm font-barlow">
          {isEmailStep 
            ? 'Sign in or create your account to continue'
            : `We've sent a 6-digit code to ${email}`
          }
        </p>
      </div>

      {/* Email Form */}
      {isEmailStep && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-brand-offwhite/80 text-sm font-barlow mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-offwhite/40" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className={`
                  w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-brand-offwhite/20 
                  rounded-lg text-brand-offwhite placeholder-brand-offwhite/40
                  focus:outline-none focus:ring-2 focus:ring-brand-offwhite/20 focus:border-brand-offwhite/40
                  transition-all duration-200
                  ${email && !isValidEmail(email) ? 'border-red-400/50' : ''}
                `}
                disabled={isLoading}
              />
            </div>
            {email && !isValidEmail(email) && (
              <p className="mt-1 text-red-400 text-xs">Please enter a valid email address</p>
            )}
          </div>

          {/* Name Field (Optional - for signup) */}
          <div>
            <label className="block text-brand-offwhite/80 text-sm font-barlow mb-2">
              Full Name <span className="text-brand-offwhite/40">(optional)</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-offwhite/40" />
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-brand-offwhite/20 rounded-lg text-brand-offwhite placeholder-brand-offwhite/40 focus:outline-none focus:ring-2 focus:ring-brand-offwhite/20 focus:border-brand-offwhite/40 transition-all duration-200"
                disabled={isLoading}
              />
            </div>
            <p className="mt-1 text-brand-offwhite/40 text-xs">
              Add your name to create a new account, or leave empty to sign in
            </p>
          </div>

          {/* Role Field (Optional - for signup) */}
          {name.trim() && (
            <div>
              <label className="block text-brand-offwhite/80 text-sm font-barlow mb-2">
                Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-offwhite/40" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-brand-offwhite/20 rounded-lg text-brand-offwhite focus:outline-none focus:ring-2 focus:ring-brand-offwhite/20 focus:border-brand-offwhite/40 transition-all duration-200 appearance-none"
                  disabled={isLoading}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          )}

          {/* Avatar Field (Optional - for signup) */}
          {name.trim() && (
            <div>
              <label className="block text-brand-offwhite/80 text-sm font-barlow mb-2">
                Avatar URL <span className="text-brand-offwhite/40">(optional)</span>
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-3 bg-white/[0.05] border border-brand-offwhite/20 rounded-lg text-brand-offwhite placeholder-brand-offwhite/40 focus:outline-none focus:ring-2 focus:ring-brand-offwhite/20 focus:border-brand-offwhite/40 transition-all duration-200"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canSubmitEmail}
            className="w-full py-3 bg-brand-offwhite text-black font-barlow font-semibold rounded-lg hover:bg-brand-offwhite/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : name.trim() ? 'Create Account & Send OTP' : 'Send OTP'}
          </button>
        </form>
      )}

      {/* OTP Verification */}
      {isOTPFlow && (
        <div className="space-y-6">
          {/* OTP Input */}
          <div>
            <OTPInput
              value={otp}
              onChange={setOTP}
              onComplete={handleOTPVerify}
              disabled={isLoading}
            />
            <p className="text-center text-brand-offwhite/40 text-xs mt-4">
              OTP expires in 5 minutes
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {isNewUser && !error && (
            <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-green-400 text-sm">
                  New account created! Check your email for the OTP.
                </p>
              </div>
            </div>
          )}

          {/* Back Button */}
          <button
            onClick={handleBackToEmail}
            disabled={isLoading}
            className="w-full py-2 bg-white/[0.05] border border-brand-offwhite/20 text-brand-offwhite font-barlow rounded-lg hover:bg-white/[0.10] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Email
          </button>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 text-center">
        <p className="text-brand-offwhite/40 text-xs font-barlow">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
  }
};

export default AuthForm;
