/**
 * OrganizationPage
 * Admin page for managing organization details,
 * viewing API keys summary and member count.
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import {
  Building2, ChevronLeft, Save, Key, Users,
  Calendar, Activity, Loader2, ExternalLink
} from 'lucide-react'
import organizationService from '../../../services/organization.service.js'
import useToast, { ToastContainer } from '../../../hooks/useToast.jsx'
import useProfile from '../../../hooks/useProfile.js'

export default function OrganizationPage() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { members, getMembers } = useProfile()
  const { toasts, addToast, removeToast } = useToast()
  const isAdmin = user?.role === 'admin'

  const [org, setOrg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '' })

  useEffect(() => {
    if (!user?.organizationId) return

    const loadData = async () => {
      try {
        const res = await organizationService.getOrganization(user.organizationId)
        setOrg(res.data)
        setForm({ name: res.data?.name || '' })
      } catch (err) {
        addToast('Failed to load organization', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadData()
    getMembers().catch(() => {})
  }, [user?.organizationId])

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const res = await organizationService.updateOrganization(user.organizationId, form)
      setOrg(res.data)
      addToast('Organization updated', 'success')
    } catch (err) {
      addToast(err.message || 'Failed to update', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
              / ORGANIZATION
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: '0.06em', margin: '0 0 8px 0' }}>
            ORGANIZATION
          </h1>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 32 }}>
            Manage your organization settings and details
          </div>

          {/* Org Name Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Building2 size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <div style={labelStyle}>ORGANIZATION NAME</div>
            </div>
            {isAdmin ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 16,
                    letterSpacing: '0.06em',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    padding: '10px 16px',
                    color: '#fff',
                    outline: 'none',
                    flex: 1,
                  }}
                  maxLength={100}
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    background: 'rgba(34,197,94,0.12)',
                    border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: 8,
                    padding: '10px 20px',
                    color: '#22c55e',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    opacity: saving ? 0.5 : 1,
                  }}
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  SAVE
                </button>
              </div>
            ) : (
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, letterSpacing: '0.06em', color: '#fff' }}>
                {org?.name || 'Unknown'}
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 24 }}>
            {/* Members */}
            <div
              style={{ ...cardStyle, cursor: isAdmin ? 'pointer' : 'default' }}
              onClick={() => isAdmin && navigate('/employees')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Users size={14} style={{ color: '#3b82f6' }} />
                <div style={labelStyle}>TEAM MEMBERS</div>
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#fff', lineHeight: 1 }}>
                {members.length || 0}
              </div>
              {isAdmin && (
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, color: '#3b82f6', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  MANAGE <ExternalLink size={10} />
                </div>
              )}
            </div>

            {/* API Keys */}
            <div
              style={{ ...cardStyle, cursor: 'pointer' }}
              onClick={() => navigate('/dashboard')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Key size={14} style={{ color: '#f97316' }} />
                <div style={labelStyle}>API KEYS</div>
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#fff', lineHeight: 1 }}>
                {org?.apiKeys?.length || 0}
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, color: '#f97316', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                MANAGE <ExternalLink size={10} />
              </div>
            </div>

            {/* Created */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Calendar size={14} style={{ color: '#22c55e' }} />
                <div style={labelStyle}>CREATED</div>
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#fff', lineHeight: 1.2 }}>
                {org?.createdAt ? new Date(org.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
              </div>
            </div>

            {/* Status */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Activity size={14} style={{ color: org?.isActive ? '#22c55e' : '#ef4444' }} />
                <div style={labelStyle}>STATUS</div>
              </div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: org?.isActive ? '#22c55e' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: org?.isActive ? '#22c55e' : '#ef4444',
                  display: 'inline-block',
                }} />
                {org?.isActive ? 'ACTIVE' : 'INACTIVE'}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ ...cardStyle, marginTop: 24 }}>
            <div style={{ ...labelStyle, marginBottom: 16 }}>QUICK ACTIONS</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {isAdmin && (
                <button
                  onClick={() => navigate('/employees')}
                  style={linkBtnStyle}
                >
                  <Users size={12} /> MANAGE TEAM
                </button>
              )}
              <button
                onClick={() => navigate('/profile')}
                style={linkBtnStyle}
              >
                <Users size={12} /> MY PROFILE
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                style={linkBtnStyle}
              >
                <Activity size={12} /> DASHBOARD
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  padding: '20px 24px',
}

const labelStyle = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 9,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.3)',
}

const linkBtnStyle = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8,
  padding: '10px 20px',
  color: 'rgba(255,255,255,0.6)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  transition: 'all 0.15s',
}
