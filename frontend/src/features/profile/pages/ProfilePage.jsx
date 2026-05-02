/**
 * ProfilePage
 * Full profile management with skills editor, availability toggle,
 * and organization info. Follows OpsPulse dark theme.
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import {
  User, Mail, Phone, FileText, Shield, Clock,
  ChevronLeft, Save, X, Plus, ToggleLeft, ToggleRight,
  Activity, Loader2
} from 'lucide-react'
import useProfile from '../../../hooks/useProfile.js'
import useToast, { ToastContainer } from '../../../hooks/useToast.jsx'

const ALLOWED_SKILLS = [
  'payment', 'database', 'auth', 'api',
  'infra', 'network', 'frontend', 'backend',
]

const SKILL_COLORS = {
  payment: '#f97316',
  database: '#3b82f6',
  auth: '#22c55e',
  api: '#818cf8',
  infra: '#ef4444',
  network: '#f59e0b',
  frontend: '#06b6d4',
  backend: '#a855f7',
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { profile, loading, error, updateSuccess, getProfile, updateProfile, clearUpdateSuccess } = useProfile()
  const { toasts, addToast, removeToast } = useToast()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    bio: '',
    avatar: '',
    skills: [],
    available: true,
  })
  const [saving, setSaving] = useState(false)

  // Load profile on mount
  useEffect(() => {
    getProfile().catch(() => {})
  }, [])

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        skills: profile.skills || [],
        available: profile.available !== false,
      })
    }
  }, [profile])

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      addToast('Profile updated successfully', 'success')
      clearUpdateSuccess()
    }
  }, [updateSuccess])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(form)
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  const getInitials = (name) => {
    if (!name) return '??'
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const roleLabel = (role) => {
    if (role === 'admin') return 'ADMIN'
    if (role === 'responder') return 'RESPONDER'
    return 'EMPLOYEE'
  }

  const roleColor = (role) => {
    if (role === 'admin') return '#ef4444'
    if (role === 'responder') return '#f97316'
    return '#3b82f6'
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={24} className="text-white/40 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="border-b border-white/[0.07] bg-[#07080f]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-white/40 hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer p-1"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/[0.08] border border-white/20 rounded-md flex items-center justify-center">
                <Activity size={14} className="text-white" />
              </div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, letterSpacing: '0.18em' }}>
                OPSPULSE
              </span>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
              / PROFILE
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Profile Header Card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: '28px 32px',
              marginBottom: 24,
            }}
          >
            <div className="flex items-start gap-5 flex-wrap sm:flex-nowrap">
              {/* Avatar */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {profile?.avatar && profile.avatar !== 'https://res.cloudinary.com/di77yygcs/image/upload/v1777048491/blog/csyh9zademalguzxpr9a.jpg' ? (
                  <img src={profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  getInitials(profile?.name)
                )}
                <span
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: form.available ? '#22c55e' : '#6b7280',
                    border: '2.5px solid #07080f',
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h1
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 28,
                    letterSpacing: '0.08em',
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                >
                  {profile?.name || 'User'}
                </h1>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 12,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: 4,
                  }}
                >
                  {profile?.email}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 10,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      background: `${roleColor(profile?.role)}20`,
                      color: roleColor(profile?.role),
                      border: `1px solid ${roleColor(profile?.role)}40`,
                      padding: '3px 10px',
                      borderRadius: 20,
                    }}
                  >
                    {roleLabel(profile?.role)}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 10,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      background: form.available ? 'rgba(34,197,94,0.12)' : 'rgba(107,114,128,0.12)',
                      color: form.available ? '#22c55e' : '#6b7280',
                      border: `1px solid ${form.available ? 'rgba(34,197,94,0.25)' : 'rgba(107,114,128,0.25)'}`,
                      padding: '3px 10px',
                      borderRadius: 20,
                    }}
                  >
                    {form.available ? '● AVAILABLE' : '○ UNAVAILABLE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Name */}
            <div style={fieldStyle}>
              <label style={labelStyle}><User size={10} /> NAME</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                placeholder="Your name"
                maxLength={50}
              />
            </div>

            {/* Phone */}
            <div style={fieldStyle}>
              <label style={labelStyle}><Phone size={10} /> PHONE</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={inputStyle}
                placeholder="Phone number"
                maxLength={20}
              />
            </div>

            {/* Bio (full width) */}
            <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
              <label style={labelStyle}><FileText size={10} /> BIO</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                placeholder="Short bio about yourself"
                maxLength={300}
              />
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'right', marginTop: 4 }}>
                {form.bio.length}/300
              </div>
            </div>

            {/* Avatar URL */}
            <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
              <label style={labelStyle}><User size={10} /> AVATAR URL</label>
              <input
                type="text"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                style={inputStyle}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div
            style={{
              ...cardStyle,
              marginTop: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ ...labelStyle, marginBottom: 4 }}>AVAILABILITY</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                When available, the AI assignment engine can assign incidents to you based on your skills
              </div>
            </div>
            <button
              onClick={() => setForm({ ...form, available: !form.available })}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: form.available ? '#22c55e' : 'rgba(255,255,255,0.25)',
                transition: 'color 0.2s',
                padding: 4,
              }}
            >
              {form.available ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>

          {/* Skills Section */}
          <div style={{ ...cardStyle, marginTop: 24 }}>
            <div style={{ ...labelStyle, marginBottom: 12 }}>
              <Shield size={10} /> SKILLS — SELECT YOUR EXPERTISE AREAS
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
              The AI assignment engine matches incident tags to your skills to route the right incidents to you
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {ALLOWED_SKILLS.map((skill) => {
                const isSelected = form.skills.includes(skill)
                const color = SKILL_COLORS[skill] || '#3b82f6'
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 11,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      background: isSelected ? `${color}20` : 'rgba(255,255,255,0.03)',
                      color: isSelected ? color : 'rgba(255,255,255,0.35)',
                      border: `1px solid ${isSelected ? `${color}50` : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 20,
                      padding: '7px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {isSelected ? <X size={10} /> : <Plus size={10} />}
                    {skill}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Organization Info */}
          {profile?.organizationId && (
            <div style={{ ...cardStyle, marginTop: 24 }}>
              <div style={{ ...labelStyle, marginBottom: 8 }}>ORGANIZATION</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, letterSpacing: '0.08em', color: '#fff' }}>
                {typeof profile.organizationId === 'object'
                  ? profile.organizationId.name
                  : 'Organization'}
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                {typeof profile.organizationId === 'object' && profile.organizationId.createdAt
                  ? `Created ${new Date(profile.organizationId.createdAt).toLocaleDateString()}`
                  : ''}
              </div>
            </div>
          )}

          {/* Account Info */}
          <div style={{ ...cardStyle, marginTop: 24 }}>
            <div style={{ ...labelStyle, marginBottom: 8 }}>ACCOUNT INFO</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                  EMAIL
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                  {profile?.email}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                  LAST LOGIN
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                  {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'Never'}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                  MEMBER SINCE
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                  ACTIVE INCIDENTS
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                  {profile?.activeIncidents || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32, paddingBottom: 40 }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={ghostBtnStyle}
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                ...ghostBtnStyle,
                background: 'rgba(34,197,94,0.12)',
                borderColor: 'rgba(34,197,94,0.3)',
                color: '#22c55e',
                opacity: saving ? 0.5 : 1,
              }}
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {saving ? 'SAVING...' : 'SAVE PROFILE'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              color: '#ef4444',
              padding: '12px 16px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              marginTop: 16,
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}

// Shared styles
const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const labelStyle = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 9,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.3)',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}

const inputStyle = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 13,
  letterSpacing: '0.06em',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 14px',
  color: '#fff',
  outline: 'none',
  transition: 'border-color 0.2s',
  width: '100%',
  boxSizing: 'border-box',
}

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  padding: '20px 24px',
}

const ghostBtnStyle = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 8,
  padding: '10px 24px',
  color: 'rgba(255,255,255,0.6)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  transition: 'all 0.2s',
}
