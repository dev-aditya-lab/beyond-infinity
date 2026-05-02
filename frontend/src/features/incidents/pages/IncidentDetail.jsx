/**
 * Incident Detail Page — OpsPulse Theme
 * Display full incident details and allow status updates
 * Uses backend PUT /incidents/:id/status for status changes
 * Status enum: open | investigating | identified | resolved
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  ArrowLeft, Clock, AlertCircle, CheckCircle, Eye, Zap,
  Activity, Tag, Server, User, Calendar, Loader2
} from 'lucide-react'
import useIncidents from '../../../hooks/useIncidents.js'
import useToast from '../../../hooks/useToast.jsx'
import { ToastContainer } from '../../../hooks/useToast.jsx'
import { SEVERITY_COLORS, STATUS_COLORS, STATUS_OPTIONS } from '../../../config/constants.js'

/** Status icon mapping */
const statusIcons = {
  open: <AlertCircle size={16} strokeWidth={1.6} />,
  investigating: <Clock size={16} strokeWidth={1.6} />,
  identified: <Eye size={16} strokeWidth={1.6} />,
  resolved: <CheckCircle size={16} strokeWidth={1.6} />,
}

export const IncidentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    currentIncident, loading, error,
    getIncidentById, updateIncidentStatus, clearIncidentError
  } = useIncidents()
  const { toasts, removeToast, success, error: toastError } = useToast()
  const [statusLoading, setStatusLoading] = useState(false)

  /** Fetch incident on mount */
  useEffect(() => {
    if (id) {
      getIncidentById(id).catch((err) => {
        toastError(err.message || 'Failed to load incident', 5000)
      })
    }
  }, [id])

  /** Handle status update */
  const handleStatusUpdate = async (newStatus) => {
    if (!currentIncident?._id) return
    setStatusLoading(true)
    try {
      await updateIncidentStatus(currentIncident._id, newStatus)
      success(`Status updated to ${newStatus}`, 3000)
      // Refresh the incident
      await getIncidentById(currentIncident._id)
    } catch (err) {
      toastError(err.message || 'Failed to update status', 5000)
    } finally {
      setStatusLoading(false)
    }
  }

  /** Format date */
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  /** Loading state */
  if (loading && !currentIncident) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <div className="scanlines" />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-8 animate-pulse space-y-4">
            <div className="h-6 bg-white/[0.06] rounded w-1/3" />
            <div className="h-3 bg-white/[0.04] rounded w-2/3" />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="h-20 bg-white/[0.04] rounded-lg" />
              <div className="h-20 bg-white/[0.04] rounded-lg" />
              <div className="h-20 bg-white/[0.04] rounded-lg" />
              <div className="h-20 bg-white/[0.04] rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  /** Not found state */
  if (!loading && !currentIncident) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <div className="scanlines" />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/incidents')}
            className="font-barlow text-[10px] tracking-[0.14em] uppercase text-brand-offwhite/40 hover:text-brand-offwhite transition-colors flex items-center gap-1.5 mb-8 cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft size={14} /> Back to Incidents
          </button>
          <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg p-12 text-center">
            <AlertCircle size={42} className="mx-auto text-brand-offwhite/15 mb-4" strokeWidth={1} />
            <p className="font-bebas text-[22px] tracking-[0.12em] text-brand-offwhite/40">INCIDENT NOT FOUND</p>
          </div>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    )
  }

  const incident = currentIncident
  const sevColors = SEVERITY_COLORS[incident?.severity] || SEVERITY_COLORS.medium
  const statColors = STATUS_COLORS[incident?.status] || STATUS_COLORS.open

  return (
    <div className="min-h-screen bg-brand-bg relative">
      <div className="scanlines" />

      {/* Top bar */}
      <div className="border-b border-white/[0.07] px-6 py-4 flex items-center justify-between sticky top-0 bg-brand-bg/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <Activity size={16} className="text-brand-offwhite" />
          <span className="font-bebas text-[18px] tracking-[0.22em] text-brand-offwhite">OPSPULSE</span>
          <span className="font-barlow text-[8px] tracking-[0.16em] uppercase text-brand-offwhite/25 ml-2">/ INCIDENT DETAIL</span>
        </div>
        <button
          onClick={() => navigate('/incidents')}
          className="font-barlow text-[10px] tracking-[0.14em] uppercase text-brand-offwhite/40 hover:text-brand-offwhite transition-colors cursor-pointer bg-transparent border-none flex items-center gap-1.5"
        >
          <ArrowLeft size={12} /> All Incidents
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-barlow text-[11px] tracking-[0.08em] mb-5 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearIncidentError} className="text-red-400/60 hover:text-red-400 cursor-pointer bg-transparent border-none">✕</button>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-[#0b0d18] border border-white/[0.07] rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.07]">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0 flex-1">
                <h1 className="font-bebas text-[28px] tracking-[0.08em] text-brand-offwhite leading-tight mb-1">
                  {incident.title}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-[9px] text-brand-offwhite/25">{incident._id}</span>
                  <span className="font-barlow text-[9px] tracking-[0.12em] uppercase text-brand-offwhite/30">
                    {incident.source || 'manual'} incident
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Severity badge */}
                <span
                  className="font-barlow text-[9px] tracking-[0.16em] uppercase px-3 py-1.5 rounded-full border"
                  style={{ background: sevColors.bg, borderColor: sevColors.border, color: sevColors.text }}
                >
                  {sevColors.label}
                </span>
                {/* Status badge */}
                <span
                  className="font-barlow text-[9px] tracking-[0.16em] uppercase px-3 py-1.5 rounded-full border flex items-center gap-1.5"
                  style={{ background: statColors.bg, borderColor: statColors.border, color: statColors.text }}
                >
                  {statusIcons[incident.status]}
                  {statColors.label}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.04] border-b border-white/[0.07]">
            {/* Service */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Server size={10} className="text-brand-offwhite/25" />
                <span className="font-barlow text-[8px] tracking-[0.2em] uppercase text-brand-offwhite/30">Service</span>
              </div>
              <p className="font-barlow text-[11px] tracking-[0.08em] uppercase text-brand-offwhite">{incident.service}</p>
            </div>
            {/* Error Count */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Zap size={10} className="text-brand-offwhite/25" />
                <span className="font-barlow text-[8px] tracking-[0.2em] uppercase text-brand-offwhite/30">Errors</span>
              </div>
              <p className="font-bebas text-[22px] tracking-[0.06em] text-brand-offwhite leading-none">{incident.errorCount || 1}</p>
            </div>
            {/* Started */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar size={10} className="text-brand-offwhite/25" />
                <span className="font-barlow text-[8px] tracking-[0.2em] uppercase text-brand-offwhite/30">Started</span>
              </div>
              <p className="font-barlow text-[10px] tracking-[0.06em] text-brand-offwhite/70">{formatDate(incident.startedAt)}</p>
            </div>
            {/* Resolved */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle size={10} className="text-brand-offwhite/25" />
                <span className="font-barlow text-[8px] tracking-[0.2em] uppercase text-brand-offwhite/30">Resolved</span>
              </div>
              <p className="font-barlow text-[10px] tracking-[0.06em] text-brand-offwhite/70">{formatDate(incident.resolvedAt)}</p>
            </div>
          </div>

          {/* Description */}
          {incident.description && (
            <div className="px-6 py-5 border-b border-white/[0.07]">
              <span className="font-barlow text-[8px] tracking-[0.2em] uppercase text-brand-offwhite/30 block mb-2">Description</span>
              <p className="font-barlow text-[11px] tracking-[0.04em] text-brand-offwhite/60 leading-relaxed">
                {incident.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {incident.tags && incident.tags.length > 0 && (
            <div className="px-6 py-4 border-b border-white/[0.07]">
              <span className="font-barlow text-[8px] tracking-[0.2em] uppercase text-brand-offwhite/30 block mb-2">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {incident.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="font-barlow text-[8px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-brand-offwhite/50 flex items-center gap-1"
                  >
                    <Tag size={8} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Analysis (if available) */}
          {incident.aiAnalysis?.summary && (
            <div className="px-6 py-5 border-b border-white/[0.07]">
              <span className="font-barlow text-[8px] tracking-[0.2em] uppercase text-brand-offwhite/30 block mb-2">AI Analysis</span>
              <p className="font-barlow text-[11px] tracking-[0.04em] text-brand-offwhite/60 leading-relaxed mb-3">
                {incident.aiAnalysis.summary}
              </p>
              {incident.aiAnalysis.possibleCauses?.length > 0 && (
                <>
                  <span className="font-barlow text-[8px] tracking-[0.2em] uppercase text-brand-offwhite/25 block mb-1.5">Possible Causes</span>
                  <ul className="space-y-1">
                    {incident.aiAnalysis.possibleCauses.map((cause, i) => (
                      <li key={i} className="font-barlow text-[10px] tracking-[0.04em] text-brand-offwhite/45 flex items-start gap-2">
                        <span className="text-brand-offwhite/20 mt-0.5">•</span> {cause}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* Status Update Actions */}
          <div className="px-6 py-5">
            <span className="font-barlow text-[8px] tracking-[0.2em] uppercase text-brand-offwhite/30 block mb-3">Update Status</span>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => {
                const colors = STATUS_COLORS[status]
                const isActive = incident.status === status
                return (
                  <button
                    key={status}
                    onClick={() => !isActive && handleStatusUpdate(status)}
                    disabled={isActive || statusLoading}
                    className="font-barlow text-[9px] tracking-[0.14em] uppercase px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 flex items-center gap-1.5 disabled:cursor-not-allowed"
                    style={
                      isActive
                        ? { background: colors.bg, borderColor: colors.border, color: colors.text, opacity: 1 }
                        : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }
                    }
                  >
                    {statusLoading ? <Loader2 size={10} className="animate-spin" /> : statusIcons[status]}
                    {colors.label}
                    {isActive && <span className="text-[7px] ml-1 opacity-60">CURRENT</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default IncidentDetail
