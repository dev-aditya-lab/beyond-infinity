/**
 * Incidents List Page — OpsPulse Theme
 * Display all incidents with filtering and real-time updates
 * Uses backend status values: open | investigating | identified | resolved
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  Plus, RefreshCw, AlertCircle, Clock, CheckCircle, Search,
  ChevronRight, Zap, Eye, Activity
} from 'lucide-react'
import useIncidents from '../../../hooks/useIncidents.js'
import useToast from '../../../hooks/useToast.jsx'
import { ToastContainer } from '../../../hooks/useToast.jsx'
import { wsService } from '../../../services/websocket.service.js'
import authService from '../../../services/auth.service.js'
import { SEVERITY_COLORS, STATUS_COLORS, STATUS, STATUS_OPTIONS, SEVERITY_OPTIONS } from '../../../config/constants.js'

/** Status icon mapping */
const statusIcons = {
  open: <AlertCircle size={14} strokeWidth={1.6} />,
  investigating: <Clock size={14} strokeWidth={1.6} />,
  identified: <Eye size={14} strokeWidth={1.6} />,
  resolved: <CheckCircle size={14} strokeWidth={1.6} />,
}

export const IncidentsList = () => {
  const navigate = useNavigate()
  const {
    incidents, loading, error, total,
    getIncidents, setFilters, filters, clearIncidentError
  } = useIncidents()
  const { toasts, removeToast, error: toastError, success } = useToast()
  const [statusFilter, setStatusFilter] = useState(null)
  const [severityFilter, setSeverityFilter] = useState(null)

  /** Fetch incidents on mount and filter change */
  useEffect(() => {
    if (!authService.getToken()) return;

    const params = {}
    if (statusFilter) params.status = statusFilter
    if (severityFilter) params.severity = severityFilter
    getIncidents(params).catch((err) => {
      toastError(err.message || 'Failed to fetch incidents', 5000)
    })
  }, [statusFilter, severityFilter])

  /** Subscribe to real-time incident updates via WebSocket */
  useEffect(() => {
    if (!authService.getToken()) return;

    const handleUpdate = () => {
      getIncidents().catch(() => {})
    }
    try {
      wsService.subscribe('incident:updated', handleUpdate)
      wsService.subscribe('incident:created', handleUpdate)
      return () => {
        wsService.unsubscribe('incident:updated', handleUpdate)
        wsService.unsubscribe('incident:created', handleUpdate)
      }
    } catch (err) {
      console.warn('WebSocket not available:', err)
    }
  }, [])

  const handleIncidentClick = (id) => {
    navigate(`/incidents/${id}`)
  }

  /** Format date helper */
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-brand-bg relative">
      <div className="scanlines" />

      {/* Top bar with brand */}
      <div className="border-b border-white/[0.07] px-6 py-4 flex items-center justify-between sticky top-0 bg-brand-bg/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <Activity size={16} className="text-brand-offwhite" />
          <span className="font-bebas text-[18px] tracking-[0.22em] text-brand-offwhite">OPSPULSE</span>
          <span className="font-barlow text-[8px] tracking-[0.16em] uppercase text-brand-offwhite/25 ml-2">/ INCIDENTS</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="font-barlow text-[10px] tracking-[0.14em] uppercase text-brand-offwhite/40 hover:text-brand-offwhite transition-colors cursor-pointer bg-transparent border-none"
        >
          ← Dashboard
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-bebas text-[32px] tracking-[0.12em] text-brand-offwhite leading-none mb-1">INCIDENTS</h1>
            <p className="font-barlow text-[10px] tracking-[0.16em] uppercase text-brand-offwhite/35">
              {total} total incidents tracked
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => getIncidents()}
              className="btn-ghost btn-ghost-sm flex items-center gap-1.5"
            >
              <RefreshCw size={10} /> REFRESH
            </button>
            <button
              onClick={() => navigate('/incidents/create')}
              className="btn-ghost btn-ghost-sm flex items-center gap-1.5"
            >
              <Plus size={10} /> NEW INCIDENT
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Status filters */}
          <div className="flex gap-1">
            <button
              onClick={() => setStatusFilter(null)}
              className={`font-barlow text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-200 ${
                statusFilter === null
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-white/3 border-white/10 text-white/45 hover:text-white/70'
              }`}
            >
              ALL
            </button>
            {STATUS_OPTIONS.map((status) => {
              const colors = STATUS_COLORS[status]
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`font-barlow text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-200 ${
                    statusFilter === status
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'bg-white/3 border-white/10 text-white/45 hover:text-white/70'
                  }`}
                >
                  {colors?.label || status.toUpperCase()}
                </button>
              )
            })}
          </div>

          {/* Severity filters */}
          <div className="flex gap-1 ml-0 sm:ml-2">
            {SEVERITY_OPTIONS.map((sev) => {
              const colors = SEVERITY_COLORS[sev]
              return (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(severityFilter === sev ? null : sev)}
                  className={`font-barlow text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-200`}
                  style={
                    severityFilter === sev
                      ? { background: colors.bg, borderColor: colors.border, color: colors.text }
                      : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }
                  }
                >
                  {colors?.label || sev.toUpperCase()}
                </button>
              )
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-barlow text-[11px] tracking-[0.08em] mb-5 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearIncidentError} className="text-red-400/60 hover:text-red-400 cursor-pointer bg-transparent border-none">✕</button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/6" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/6 rounded w-1/3" />
                    <div className="h-2 bg-white/4 rounded w-1/2" />
                  </div>
                  <div className="w-16 h-5 bg-white/6 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && incidents.length === 0 && (
          <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-12 text-center">
            <AlertCircle size={42} className="mx-auto text-brand-offwhite/15 mb-4" strokeWidth={1} />
            <p className="font-bebas text-[22px] tracking-[0.12em] text-brand-offwhite/40 mb-2">NO INCIDENTS FOUND</p>
            <p className="font-barlow text-[10px] tracking-[0.14em] uppercase text-brand-offwhite/25 mb-6">
              {statusFilter || severityFilter ? 'Try adjusting your filters' : 'Create your first incident to get started'}
            </p>
            <button
              onClick={() => navigate('/incidents/create')}
              className="btn-ghost btn-ghost-sm"
            >
              <Plus size={10} className="inline mr-1.5 align-middle" /> CREATE INCIDENT
            </button>
          </div>
        )}

        {/* Incidents List */}
        {!loading && incidents.length > 0 && (
          <div className="space-y-2">
            {incidents.map((incident) => {
              const sevColors = SEVERITY_COLORS[incident.severity] || SEVERITY_COLORS.medium
              const statColors = STATUS_COLORS[incident.status] || STATUS_COLORS.open

              return (
                <div
                  key={incident._id}
                  onClick={() => handleIncidentClick(incident._id)}
                  className="bg-[#0b0d18] border border-white/[0.07] hover:border-white/[0.14] rounded-lg p-4 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Status icon */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: statColors.bg, color: statColors.text }}
                      >
                        {statusIcons[incident.status] || statusIcons.open}
                      </div>

                      {/* Title and meta */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-barlow text-[12px] tracking-[0.08em] uppercase text-brand-offwhite/85 mb-0.5 truncate group-hover:text-brand-offwhite transition-colors">
                          {incident.title}
                        </h3>
                        <div className="flex items-center gap-3 text-brand-offwhite/30">
                          <span className="font-mono text-[9px]">{incident._id?.slice(-8)}</span>
                          <span className="font-barlow text-[9px] tracking-widest uppercase">{incident.service}</span>
                          <span className="font-barlow text-[9px] tracking-widest">{formatDate(incident.startedAt || incident.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badges and chevron */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Severity badge */}
                      <span
                        className="font-barlow text-[8px] tracking-[0.16em] uppercase px-2.5 py-1 rounded-full border"
                        style={{
                          background: sevColors.bg,
                          borderColor: sevColors.border,
                          color: sevColors.text,
                        }}
                      >
                        {sevColors.label}
                      </span>
                      {/* Status badge */}
                      <span
                        className="font-barlow text-[8px] tracking-[0.16em] uppercase px-2.5 py-1 rounded-full border hidden sm:inline"
                        style={{
                          background: statColors.bg,
                          borderColor: statColors.border,
                          color: statColors.text,
                        }}
                      >
                        {statColors.label}
                      </span>
                      <ChevronRight size={14} className="text-brand-offwhite/15 group-hover:text-brand-offwhite/40 transition-colors" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default IncidentsList
