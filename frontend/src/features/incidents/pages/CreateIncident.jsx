/**
 * Create Incident Page — OpsPulse Theme
 * Form to create a new incident via POST /api/incidents
 * Backend requires: title, service, severity
 * Backend optional: description, tags
 */

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Loader2, Activity, Plus, X } from 'lucide-react'
import useIncidents from '../../../hooks/useIncidents.js'
import useToast from '../../../hooks/useToast.jsx'
import { ToastContainer } from '../../../hooks/useToast.jsx'
import { SEVERITY_OPTIONS, SEVERITY_COLORS } from '../../../config/constants.js'

export const CreateIncident = () => {
  const navigate = useNavigate()
  const { createIncident, loading, error } = useIncidents()
  const { toasts, removeToast, error: toastError, success } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    service: '',
    severity: 'medium',
    description: '',
  })
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [formError, setFormError] = useState(null)

  /** Handle form field changes */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formError) setFormError(null)
  }

  /** Add tag */
  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
      setTagInput('')
    }
  }

  /** Remove tag */
  const handleRemoveTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  /** Tag input key handler */
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  /** Validate form */
  const validateForm = () => {
    if (!formData.title.trim()) {
      setFormError('Title is required')
      return false
    }
    if (!formData.service.trim()) {
      setFormError('Service is required')
      return false
    }
    if (!formData.severity) {
      setFormError('Severity is required')
      return false
    }
    return true
  }

  /** Submit form */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const payload = {
        title: formData.title.trim(),
        service: formData.service.trim(),
        severity: formData.severity,
        description: formData.description.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      }
      await createIncident(payload)
      success('Incident created successfully', 2000)
      setTimeout(() => navigate('/incidents'), 1000)
    } catch (err) {
      toastError(err.message || 'Failed to create incident', 5000)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg relative">
      <div className="scanlines" />

      {/* Top bar */}
      <div className="border-b border-white/[0.07] px-6 py-4 flex items-center justify-between sticky top-0 bg-brand-bg/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <Activity size={16} className="text-brand-offwhite" />
          <span className="font-bebas text-[18px] tracking-[0.22em] text-brand-offwhite">OPSPULSE</span>
          <span className="font-barlow text-[8px] tracking-[0.16em] uppercase text-brand-offwhite/25 ml-2">/ NEW INCIDENT</span>
        </div>
        <button
          onClick={() => navigate('/incidents')}
          className="font-barlow text-[10px] tracking-[0.14em] uppercase text-brand-offwhite/40 hover:text-brand-offwhite transition-colors cursor-pointer bg-transparent border-none flex items-center gap-1.5"
        >
          <ArrowLeft size={12} /> All Incidents
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-bebas text-[32px] tracking-[0.12em] text-brand-offwhite leading-none mb-1">CREATE INCIDENT</h1>
          <p className="font-barlow text-[10px] tracking-[0.16em] uppercase text-brand-offwhite/35">
            Report a new system incident
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-[#0b0d18] border border-white/[0.07] rounded-lg overflow-hidden">
          <div className="p-6 space-y-5">
            {/* Error Messages */}
            {(error || formError) && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-barlow text-[11px] tracking-[0.08em]">
                {error || formError}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="incident-title" className="block font-barlow text-[9px] tracking-[0.2em] uppercase text-brand-offwhite/40 mb-2.5">
                Title <span className="text-red-400/60">*</span>
              </label>
              <input
                type="text"
                id="incident-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Database Connection Failed"
                className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] rounded-lg text-brand-offwhite font-barlow text-[12px] tracking-[0.06em] placeholder-brand-offwhite/20 focus:outline-none focus:border-brand-offwhite/30 transition-all"
                disabled={loading}
              />
            </div>

            {/* Service */}
            <div>
              <label htmlFor="incident-service" className="block font-barlow text-[9px] tracking-[0.2em] uppercase text-brand-offwhite/40 mb-2.5">
                Service <span className="text-red-400/60">*</span>
              </label>
              <input
                type="text"
                id="incident-service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                placeholder="e.g., API Server, Database, Payment Service"
                className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] rounded-lg text-brand-offwhite font-barlow text-[12px] tracking-[0.06em] placeholder-brand-offwhite/20 focus:outline-none focus:border-brand-offwhite/30 transition-all"
                disabled={loading}
              />
            </div>

            {/* Severity */}
            <div>
              <label className="block font-barlow text-[9px] tracking-[0.2em] uppercase text-brand-offwhite/40 mb-2.5">
                Severity <span className="text-red-400/60">*</span>
              </label>
              <div className="flex gap-2">
                {SEVERITY_OPTIONS.map((sev) => {
                  const colors = SEVERITY_COLORS[sev]
                  const isActive = formData.severity === sev
                  return (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, severity: sev }))}
                      className="font-barlow text-[9px] tracking-[0.14em] uppercase px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 flex-1"
                      style={
                        isActive
                          ? { background: colors.bg, borderColor: colors.border, color: colors.text }
                          : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }
                      }
                    >
                      {colors.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block font-barlow text-[9px] tracking-[0.2em] uppercase text-brand-offwhite/40 mb-2.5">
                Tags (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] rounded-lg text-brand-offwhite font-barlow text-[11px] tracking-[0.06em] placeholder-brand-offwhite/20 focus:outline-none focus:border-brand-offwhite/30 transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-lg text-brand-offwhite/50 hover:text-brand-offwhite hover:border-white/[0.2] transition-all cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-barlow text-[8px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-brand-offwhite/50 flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-brand-offwhite/30 hover:text-brand-offwhite cursor-pointer bg-transparent border-none"
                      >
                        <X size={8} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="incident-description" className="block font-barlow text-[9px] tracking-[0.2em] uppercase text-brand-offwhite/40 mb-2.5">
                Description (Optional)
              </label>
              <textarea
                id="incident-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about the incident..."
                rows={5}
                className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] rounded-lg text-brand-offwhite font-barlow text-[12px] tracking-[0.06em] placeholder-brand-offwhite/20 focus:outline-none focus:border-brand-offwhite/30 transition-all resize-none"
                disabled={loading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-white/[0.07] flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-barlow text-[11px] tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 bg-white/[0.08] border border-white/[0.16] text-brand-offwhite hover:bg-white/[0.14] hover:border-white/[0.28] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> CREATING...</>
              ) : (
                'CREATE INCIDENT'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/incidents')}
              className="flex-1 py-3 rounded-lg font-barlow text-[11px] tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer bg-white/[0.03] border border-white/[0.08] text-brand-offwhite/50 hover:bg-white/[0.06] hover:text-brand-offwhite/70"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default CreateIncident
