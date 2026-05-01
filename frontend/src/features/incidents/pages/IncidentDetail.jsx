/**
 * Incident Detail Page
 * Display full incident details and allow status updates
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import useIncidents from '../../../hooks/useIncidents.js'
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react'

const statusOptions = ['open', 'in_progress', 'resolved']
const severityOptions = ['low', 'medium', 'high', 'critical']

export const IncidentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentIncident, loading, error, getIncidentById, updateIncident } = useIncidents()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    if (id) {
      getIncidentById(id)
    }
  }, [id])

  useEffect(() => {
    if (currentIncident) {
      setEditData(currentIncident)
    }
  }, [currentIncident])

  const handleUpdate = async () => {
    setUpdateLoading(true)
    try {
      await updateIncident(id, editData)
      setIsEditing(false)
    } catch (err) {
      console.error('Update failed:', err)
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded p-8 animate-pulse h-96" />
        </div>
      </div>
    )
  }

  if (!currentIncident) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/incidents')}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8"
          >
            <ArrowLeft size={20} />
            Back to Incidents
          </button>
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">Incident not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/incidents')}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8"
        >
          <ArrowLeft size={20} />
          Back to Incidents
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-700/50 rounded text-red-400 mb-6">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-gray-900 border border-gray-800 rounded p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="text-3xl font-bold text-white bg-gray-800 border border-gray-700 rounded px-4 py-2 mb-2"
                />
              ) : (
                <h1 className="text-3xl font-bold text-white mb-2">{currentIncident.title}</h1>
              )}
              <div className="flex gap-4 text-gray-400">
                <span>ID: {currentIncident.id}</span>
                <span>Created: {new Date(currentIncident.created).toLocaleDateString()}</span>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Service */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Service</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.service}
                  onChange={(e) => handleChange('service', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white">{currentIncident.service}</p>
              )}
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Severity</label>
              {isEditing ? (
                <select
                  value={editData.severity}
                  onChange={(e) => handleChange('severity', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                >
                  {severityOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-white capitalize">{currentIncident.severity}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              {isEditing ? (
                <select
                  value={editData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-white capitalize">{currentIncident.status.replace('_', ' ')}</p>
              )}
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Assignee</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.assignee}
                  onChange={(e) => handleChange('assignee', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white">{currentIncident.assignee}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            {isEditing ? (
              <textarea
                value={editData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-300">{currentIncident.description || 'No description provided'}</p>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                disabled={updateLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded transition-colors"
              >
                {updateLoading ? 'Updating...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditData(currentIncident)
                }}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IncidentDetail
