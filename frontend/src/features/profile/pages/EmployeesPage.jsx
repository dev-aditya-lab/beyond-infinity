/**
 * EmployeesPage
 * Admin-only page for managing organization members.
 * Add employees, change roles, remove members.
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import {
  Users, ChevronLeft, Plus, X, Search,
  Shield, UserCheck, UserMinus, Activity, Loader2, Mail
} from 'lucide-react'
import useProfile from '../../../hooks/useProfile.js'
import useToast, { ToastContainer } from '../../../hooks/useToast.jsx'

const ROLES = ['admin', 'responder', 'employee']
const SKILL_COLORS = {
  payment: '#f97316', database: '#3b82f6', auth: '#22c55e', api: '#818cf8',
  infra: '#ef4444', network: '#f59e0b', frontend: '#06b6d4', backend: '#a855f7',
}

export default function EmployeesPage() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const {
    members, membersCount, membersLoading, membersError,
    getMembers, addMember, removeMember, changeMemberRole,
  } = useProfile()
  const { toasts, addToast, removeToast } = useToast()

  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [addForm, setAddForm] = useState({ email: '', name: '', role: 'employee' })
  const [addLoading, setAddLoading] = useState(false)

  // Redirect non-admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard')
    }
  }, [user])

  // Load members
  useEffect(() => {
    getMembers().catch(() => {})
  }, [])

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!addForm.email) return
    setAddLoading(true)
    try {
      await addMember(addForm)
      addToast('Member added successfully', 'success')
      setAddForm({ email: '', name: '', role: 'employee' })
      setShowAddModal(false)
    } catch (err) {
      addToast(err.message || 'Failed to add member', 'error')
    } finally {
      setAddLoading(false)
    }
  }

  const handleRemoveMember = async (id, name) => {
    if (!confirm(`Remove ${name} from the organization?`)) return
    try {
      await removeMember(id)
      addToast(`${name} removed`, 'success')
    } catch (err) {
      addToast(err.message || 'Failed to remove member', 'error')
    }
  }

  const handleRoleChange = async (id, newRole) => {
    try {
      await changeMemberRole(id, newRole)
      addToast(`Role updated to ${newRole}`, 'success')
    } catch (err) {
      addToast(err.message || 'Failed to update role', 'error')
    }
  }

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      !search ||
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = !roleFilter || m.role === roleFilter
    return matchSearch && matchRole
  })

  const getInitials = (name) => {
    if (!name) return '??'
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const roleColor = (role) => {
    if (role === 'admin') return '#ef4444'
    if (role === 'responder') return '#f97316'
    return '#3b82f6'
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="border-b border-white/[0.07] bg-[#07080f]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
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
              / TEAM MEMBERS
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Title + Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: '0.06em', margin: 0 }}>
                TEAM MEMBERS
              </h1>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {membersCount} MEMBER{membersCount !== 1 ? 'S' : ''} IN ORGANIZATION
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
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
                gap: 8,
              }}
            >
              <Plus size={14} /> ADD MEMBER
            </button>
          </div>

          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '10px 14px 10px 36px',
                  color: '#fff',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['', ...ROLES].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    background: roleFilter === r ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${roleFilter === r ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 6,
                    padding: '8px 14px',
                    color: roleFilter === r ? '#fff' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {r || 'ALL'}
                </button>
              ))}
            </div>
          </div>

          {/* Members List */}
          {membersLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="text-white/30 animate-spin" />
            </div>
          ) : membersError ? (
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              color: '#ef4444',
              padding: '16px 20px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
            }}>
              {membersError}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredMembers.length === 0 ? (
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.3)',
                  textAlign: 'center',
                  padding: '40px 0',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  No members found
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <div
                    key={member._id}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 10,
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      flexWrap: 'wrap',
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#fff',
                        flexShrink: 0,
                        position: 'relative',
                      }}
                    >
                      {getInitials(member.name)}
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: member.available !== false ? '#22c55e' : '#6b7280',
                          border: '2px solid #0a0b12',
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: '0.06em', color: '#fff' }}>
                        {member.name || 'Unnamed'}
                      </div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>
                        {member.email}
                      </div>
                    </div>

                    {/* Skills */}
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', flex: '1 0 120px' }}>
                      {(member.skills || []).slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: 9,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            background: `${SKILL_COLORS[skill] || '#3b82f6'}18`,
                            color: SKILL_COLORS[skill] || '#3b82f6',
                            padding: '2px 8px',
                            borderRadius: 12,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                      {!member.skills?.length && (
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>
                          No skills
                        </span>
                      )}
                    </div>

                    {/* Active Incidents */}
                    <div style={{ textAlign: 'center', minWidth: 60 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                        INCIDENTS
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#fff' }}>
                        {member.activeIncidents || 0}
                      </div>
                    </div>

                    {/* Role Selector */}
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member._id, e.target.value)}
                      disabled={member._id === user?._id}
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 10,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        background: `${roleColor(member.role)}15`,
                        border: `1px solid ${roleColor(member.role)}30`,
                        borderRadius: 6,
                        padding: '6px 10px',
                        color: roleColor(member.role),
                        cursor: member._id === user?._id ? 'not-allowed' : 'pointer',
                        outline: 'none',
                        opacity: member._id === user?._id ? 0.5 : 1,
                      }}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r} style={{ background: '#111', color: '#fff' }}>
                          {r.toUpperCase()}
                        </option>
                      ))}
                    </select>

                    {/* Remove button */}
                    {member._id !== user?._id && (
                      <button
                        onClick={() => handleRemoveMember(member._id, member.name)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'rgba(255,255,255,0.2)',
                          padding: 6,
                          transition: 'color 0.15s',
                        }}
                        title="Remove from organization"
                        onMouseEnter={(e) => (e.target.style.color = '#ef4444')}
                        onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.2)')}
                      >
                        <UserMinus size={16} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Add Member Modal */}
        {showAddModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
            onClick={() => setShowAddModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#0c0d14',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14,
                padding: '28px 32px',
                width: '100%',
                maxWidth: 420,
                margin: '0 16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: '0.08em', margin: 0 }}>
                  ADD TEAM MEMBER
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4 }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddMember}>
                <div style={{ marginBottom: 16 }}>
                  <label style={modalLabelStyle}><Mail size={10} /> EMAIL</label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    style={modalInputStyle}
                    placeholder="member@company.com"
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={modalLabelStyle}><Users size={10} /> NAME (OPTIONAL)</label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    style={modalInputStyle}
                    placeholder="Team member name"
                    maxLength={50}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={modalLabelStyle}><Shield size={10} /> ROLE</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setAddForm({ ...addForm, role: r })}
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 11,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          background: addForm.role === r ? `${roleColor(r)}20` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${addForm.role === r ? `${roleColor(r)}50` : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: 6,
                          padding: '8px 16px',
                          color: addForm.role === r ? roleColor(r) : 'rgba(255,255,255,0.4)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          flex: 1,
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>
                    {addForm.role === 'admin' && '● Full system access, can manage members and incidents'}
                    {addForm.role === 'responder' && '● Can handle and resolve assigned incidents'}
                    {addForm.role === 'employee' && '● Read-only access to dashboard and incidents'}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={addLoading || !addForm.email}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 12,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    background: 'rgba(34,197,94,0.12)',
                    border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: 8,
                    padding: '12px 24px',
                    color: '#22c55e',
                    cursor: addLoading ? 'wait' : 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    opacity: addLoading ? 0.5 : 1,
                  }}
                >
                  {addLoading ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                  {addLoading ? 'ADDING...' : 'ADD TO TEAM'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}

const modalLabelStyle = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 9,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.3)',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginBottom: 6,
}

const modalInputStyle = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: 13,
  letterSpacing: '0.06em',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 14px',
  color: '#fff',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}
