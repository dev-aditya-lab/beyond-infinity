/**
 * OnboardingPage
 * Shown after signup when user has no organization.
 * Two paths:
 * 1. CREATE — Admin creates a new organization
 * 2. WAIT — Employee waits for admin to add them
 */

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import {
  Building2, Users, ArrowRight, Loader2, Activity,
  Shield, UserCheck, Mail
} from 'lucide-react'
import profileService from '../../../services/profile.service.js'
import { setUser } from '../../../features/auth/auth.slice.js'
import useToast, { ToastContainer } from '../../../hooks/useToast.jsx'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { toasts, addToast, removeToast } = useToast()

  const [mode, setMode] = useState(null) // null | 'create' | 'wait'
  const [orgName, setOrgName] = useState('')
  const [creating, setCreating] = useState(false)

  // If user already has org, redirect
  if (user?.organizationId) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleCreateOrg = async (e) => {
    e.preventDefault()
    if (!orgName.trim()) return

    setCreating(true)
    try {
      const res = await profileService.createOrganization({ name: orgName.trim() })
      // Update user in Redux
      dispatch(setUser(res.data))
      addToast('Organization created! Redirecting...', 'success')
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      addToast(err.message || 'Failed to create organization', 'error')
    } finally {
      setCreating(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

        <div className="w-full max-w-[560px] relative z-10">
          {/* Brand */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-white/[0.08] border border-white/20 rounded-lg flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: '0.22em' }}>
                OPSPULSE
              </span>
            </div>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              WELCOME, {user?.name?.toUpperCase() || 'USER'} — LET'S GET YOU SET UP
            </p>
          </div>

          {/* Mode Selection */}
          {mode === null && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Option 1: Create Org */}
              <button
                onClick={() => setMode('create')}
                style={{
                  background: '#0b0d18',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '28px 28px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)'; e.currentTarget.style.background = 'rgba(34,197,94,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#0b0d18'; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Building2 size={22} style={{ color: '#22c55e' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.08em', color: '#fff', marginBottom: 4 }}>
                    CREATE AN ORGANIZATION
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', lineHeight: 1.6 }}>
                    Set up your organization as an <strong style={{ color: '#22c55e' }}>Admin</strong>. You'll be able to add team members, generate API keys, and manage incidents.
                  </div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: '#22c55e', marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <Shield size={12} /> I'M AN ADMIN / TEAM LEAD <ArrowRight size={12} />
                  </div>
                </div>
              </button>

              {/* Option 2: Wait for admin */}
              <button
                onClick={() => setMode('wait')}
                style={{
                  background: '#0b0d18',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '28px 28px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.background = 'rgba(59,130,246,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#0b0d18'; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Users size={22} style={{ color: '#3b82f6' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.08em', color: '#fff', marginBottom: 4 }}>
                    JOIN AN EXISTING TEAM
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', lineHeight: 1.6 }}>
                    Your organization admin needs to add you first. Ask them to add <strong style={{ color: '#3b82f6' }}>{user?.email}</strong> as a team member.
                  </div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: '#3b82f6', marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <UserCheck size={12} /> I'M A TEAM MEMBER <ArrowRight size={12} />
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Create Org Form */}
          {mode === 'create' && (
            <div style={{
              background: '#0b0d18',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
              padding: '32px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Building2 size={18} style={{ color: '#22c55e' }} />
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.1em' }}>
                  CREATE ORGANIZATION
                </div>
              </div>

              <form onSubmit={handleCreateOrg}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 8,
                  }}>
                    ORGANIZATION NAME
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Acme Inc."
                    required
                    maxLength={100}
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: '0.06em',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, padding: '12px 16px', color: '#fff', outline: 'none',
                      width: '100%', boxSizing: 'border-box',
                    }}
                    autoFocus
                  />
                </div>

                <div style={{
                  background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)',
                  borderRadius: 8, padding: '12px 16px', marginBottom: 24,
                }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', lineHeight: 1.6 }}>
                    ✓ You'll be set as <strong style={{ color: '#22c55e' }}>Admin</strong><br />
                    ✓ You can add team members from the dashboard<br />
                    ✓ You can generate API keys for integration
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setMode(null)}
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 8, padding: '12px 20px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                    }}
                  >
                    BACK
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !orgName.trim()}
                    style={{
                      flex: 1, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
                      background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
                      borderRadius: 8, padding: '12px 24px', color: '#22c55e', cursor: creating ? 'wait' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      opacity: creating || !orgName.trim() ? 0.5 : 1,
                    }}
                  >
                    {creating ? <Loader2 size={14} className="animate-spin" /> : <Building2 size={14} />}
                    {creating ? 'CREATING...' : 'CREATE ORGANIZATION'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Wait for Admin */}
          {mode === 'wait' && (
            <div style={{
              background: '#0b0d18',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
              padding: '32px',
              textAlign: 'center',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Mail size={28} style={{ color: '#3b82f6' }} />
              </div>

              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: '0.08em', marginBottom: 8 }}>
                WAITING FOR YOUR ADMIN
              </div>

              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', lineHeight: 1.7, marginBottom: 20, maxWidth: 380, margin: '0 auto 20px' }}>
                Ask your organization admin to add your email to the team:
              </div>

              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, color: '#3b82f6',
                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 8, padding: '12px 20px', letterSpacing: '0.06em',
                marginBottom: 24, wordBreak: 'break-all',
              }}>
                {user?.email}
              </div>

              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.1em', lineHeight: 1.7, marginBottom: 28,
              }}>
                Once they add you, log out and log back in to access the dashboard.
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8, padding: '16px', marginBottom: 24,
              }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
                  STEPS FOR YOUR ADMIN
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', lineHeight: 1.8, textAlign: 'left' }}>
                  1. Go to <strong style={{ color: '#fff' }}>Dashboard → Team Members</strong><br />
                  2. Click <strong style={{ color: '#22c55e' }}>Add Member</strong><br />
                  3. Enter your email: <strong style={{ color: '#3b82f6' }}>{user?.email}</strong><br />
                  4. Select a role (Responder / Employee)
                </div>
              </div>

              <button
                onClick={() => setMode(null)}
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 8, padding: '12px 24px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                }}
              >
                BACK TO OPTIONS
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}
