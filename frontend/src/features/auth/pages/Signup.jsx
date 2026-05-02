/**
 * Signup Page — OpsPulse Theme
 * OTP-based account creation with 2 steps:
 * 1. Enter name + email → sends OTP via backend POST /auth/send-otp
 * 2. Enter 6-digit OTP → verifies via backend POST /auth/verify-otp
 * No passwords — email OTP only
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Mail, User, KeyRound, ArrowLeft, Loader2, Activity } from 'lucide-react'
import useAuth from '../../../hooks/useAuth.js'
import useToast from '../../../hooks/useToast.jsx'
import { ToastContainer } from '../../../hooks/useToast.jsx'

const Signup = () => {
  const navigate = useNavigate()
  const { sendOTP, verifyOTP, loading, error, clearAuthError } = useAuth()
  const { toasts, removeToast, error: toastError, success } = useToast()

  const [step, setStep] = useState(1) // Step 1: Name/Email, Step 2: OTP
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [formError, setFormError] = useState(null)

  /** Clear errors on input change */
  const handleNameChange = (e) => {
    setName(e.target.value)
    if (error) clearAuthError()
    if (formError) setFormError(null)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (error) clearAuthError()
    if (formError) setFormError(null)
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
    if (error) clearAuthError()
    if (formError) setFormError(null)
  }

  /** Validate name + email */
  const validateForm = () => {
    if (!name.trim()) {
      setFormError('Please enter your name')
      return false
    }
    if (name.trim().length < 2) {
      setFormError('Name must be at least 2 characters')
      return false
    }
    if (!email.trim()) {
      setFormError('Please enter your email')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email')
      return false
    }
    return true
  }

  /** Validate OTP */
  const validateOTP = () => {
    if (!otp.trim()) {
      setFormError('Please enter the OTP code')
      return false
    }
    if (otp.length !== 6) {
      setFormError('OTP must be 6 digits')
      return false
    }
    return true
  }

  /** Step 1: Send OTP (with name for new account creation) */
  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await sendOTP(email, name)
      success('OTP sent to your email', 3000)
      setStep(2)
      setFormError(null)
    } catch (err) {
      toastError(err.message || 'Failed to send OTP', 5000)
    }
  }

  /** Step 2: Verify OTP and create account */
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (!validateOTP()) return

    try {
      await verifyOTP(email, otp)
      success('Account created successfully!', 1500)
      setTimeout(() => navigate('/onboarding'), 1000)
    } catch (err) {
      toastError(err.message || 'OTP verification failed', 5000)
    }
  }

  /** Go back to name/email step */
  const handleBackToForm = () => {
    setStep(1)
    setOtp('')
    setFormError(null)
    if (error) clearAuthError()
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="scanlines" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-10 h-10 bg-white/[0.08] border border-white/20 rounded-lg flex items-center justify-center">
              <Activity size={18} className="text-brand-offwhite" />
            </div>
            <span className="font-bebas text-[26px] tracking-[0.22em] text-brand-offwhite">
              OPSPULSE
            </span>
          </div>
          <p className="font-barlow text-[11px] tracking-[0.2em] uppercase text-brand-offwhite/40">
            {step === 1 ? 'CREATE YOUR ACCOUNT' : 'VERIFY YOUR EMAIL'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2 mb-8">
          <div className={`flex-1 h-[2px] rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-brand-offwhite/40' : 'bg-white/[0.07]'}`} />
          <div className={`flex-1 h-[2px] rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-brand-offwhite/40' : 'bg-white/[0.07]'}`} />
        </div>

        {/* Card */}
        <div className="bg-[#0b0d18] border border-white/[0.07] rounded-xl p-8">
          {step === 1 ? (
            /* ─── Step 1: Name & Email ─── */
            <form onSubmit={handleSendOTP} className="space-y-5">
              {/* Error Messages */}
              {(error || formError) && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-barlow text-[11px] tracking-[0.08em] flex justify-between items-center">
                  <span>{error || formError}</span>
                  <button
                    type="button"
                    onClick={() => { clearAuthError(); setFormError(null) }}
                    className="text-red-400/60 hover:text-red-400 ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Name Field */}
              <div>
                <label htmlFor="signup-name" className="block font-barlow text-[9px] tracking-[0.2em] uppercase text-brand-offwhite/40 mb-2.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-offwhite/25" />
                  <input
                    type="text"
                    id="signup-name"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] rounded-lg text-brand-offwhite font-barlow text-[12px] tracking-[0.06em] placeholder-brand-offwhite/20 focus:outline-none focus:border-brand-offwhite/30 transition-all"
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="signup-email" className="block font-barlow text-[9px] tracking-[0.2em] uppercase text-brand-offwhite/40 mb-2.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-offwhite/25" />
                  <input
                    type="email"
                    id="signup-email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="you@company.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] rounded-lg text-brand-offwhite font-barlow text-[12px] tracking-[0.06em] placeholder-brand-offwhite/20 focus:outline-none focus:border-brand-offwhite/30 transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg font-barlow text-[11px] tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 bg-white/[0.08] border border-white/[0.16] text-brand-offwhite hover:bg-white/[0.14] hover:border-white/[0.28] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> SENDING OTP...</>
                ) : (
                  'SEND OTP'
                )}
              </button>
            </form>
          ) : (
            /* ─── Step 2: OTP Verification ─── */
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              {/* Error Messages */}
              {(error || formError) && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-barlow text-[11px] tracking-[0.08em] flex justify-between items-center">
                  <span>{error || formError}</span>
                  <button
                    type="button"
                    onClick={() => { clearAuthError(); setFormError(null) }}
                    className="text-red-400/60 hover:text-red-400 ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Email Display */}
              <div className="p-3 bg-white/[0.03] border border-white/[0.07] rounded-lg">
                <span className="font-barlow text-[9px] tracking-[0.16em] uppercase text-brand-offwhite/30">Creating account for</span>
                <div className="font-barlow text-[12px] tracking-[0.06em] text-brand-offwhite mt-0.5">{name} — {email}</div>
              </div>

              {/* OTP Field */}
              <div>
                <label htmlFor="signup-otp" className="block font-barlow text-[9px] tracking-[0.2em] uppercase text-brand-offwhite/40 mb-2.5">
                  Enter 6-Digit Code
                </label>
                <div className="relative">
                  <KeyRound size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-offwhite/25" />
                  <input
                    type="text"
                    id="signup-otp"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="000000"
                    inputMode="numeric"
                    maxLength="6"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] rounded-lg text-brand-offwhite font-bebas text-[28px] tracking-[0.4em] text-center placeholder-brand-offwhite/15 focus:outline-none focus:border-brand-offwhite/30 transition-all"
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <p className="font-barlow text-[9px] tracking-[0.16em] uppercase text-brand-offwhite/25 mt-2.5 text-center">
                  Check your email for the verification code
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg font-barlow text-[11px] tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 bg-white/[0.08] border border-white/[0.16] text-brand-offwhite hover:bg-white/[0.14] hover:border-white/[0.28] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> VERIFYING...</>
                ) : (
                  'VERIFY & CREATE ACCOUNT'
                )}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToForm}
                disabled={loading}
                className="w-full py-2 font-barlow text-[10px] tracking-[0.14em] uppercase text-brand-offwhite/35 hover:text-brand-offwhite/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-transparent border-none"
              >
                <ArrowLeft size={12} /> Edit Information
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="font-barlow text-[10px] tracking-[0.14em] uppercase text-brand-offwhite/30">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-offwhite/60 hover:text-brand-offwhite transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default Signup
