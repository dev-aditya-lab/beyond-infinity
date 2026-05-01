/**
 * Incidents List Page
 * Display all incidents with filtering and pagination
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import useIncidents from '../../../hooks/useIncidents.js'
import { ChevronRight, AlertCircle, Clock, CheckCircle } from 'lucide-react'

const severityColors = {
  critical: 'bg-red-900/20 text-red-400 border-red-700/50',
  high: 'bg-orange-900/20 text-orange-400 border-orange-700/50',
  medium: 'bg-yellow-900/20 text-yellow-400 border-yellow-700/50',
  low: 'bg-blue-900/20 text-blue-400 border-blue-700/50',
}

const statusIcons = {
  open: <AlertCircle size={16} />,
  in_progress: <Clock size={16} />,
  resolved: <CheckCircle size={16} />,
}

export const IncidentsList = () => {
  const navigate = useNavigate()
  const { incidents, loading, error, getIncidents, setFilters, filters } = useIncidents()
  const [statusFilter, setStatusFilter] = useState(null)

  useEffect(() => {
    // Fetch incidents on component mount
    getIncidents()
  }, [])

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    setFilters({ status })
  }

  const handleIncidentClick = (id) => {
    navigate(`/incidents/${id}`)
  }

  const handleCreateIncident = () => {
    navigate('/incidents/create')
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Incidents</h1>
            <p className="text-gray-400">Manage and track system incidents</p>
          </div>
          <button
            onClick={handleCreateIncident}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
          >
            Create Incident
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => handleStatusFilter(null)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              statusFilter === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusFilter('open')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              statusFilter === 'open'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => handleStatusFilter('in_progress')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              statusFilter === 'in_progress'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusFilter('resolved')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              statusFilter === 'resolved'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-700/50 rounded text-red-400 mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 rounded p-4 animate-pulse h-20" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && incidents.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 mb-6">No incidents found</p>
            <button
              onClick={handleCreateIncident}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
            >
              Create First Incident
            </button>
          </div>
        )}

        {/* Incidents List */}
        {!loading && incidents.length > 0 && (
          <div className="space-y-2">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                onClick={() => handleIncidentClick(incident.id)}
                className="bg-gray-900 border border-gray-800 hover:border-blue-600/50 rounded p-4 cursor-pointer transition-all hover:bg-gray-800/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Status Icon */}
                    <div className="text-gray-500">
                      {statusIcons[incident.status] || statusIcons.open}
                    </div>

                    {/* Title and Details */}
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{incident.title}</h3>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>Service: {incident.service}</span>
                        <span>Assignee: {incident.assignee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Severity Badge */}
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium border ${
                        severityColors[incident.severity] || severityColors.medium
                      }`}
                    >
                      {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                    </span>

                    {/* Chevron Icon */}
                    <ChevronRight size={20} className="text-gray-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default IncidentsList
