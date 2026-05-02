/**
 * API Keys Management Page
 * Create, revoke, and manage API keys
 */

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Copy, Eye, EyeOff, Trash2, Plus } from 'lucide-react'
import { addApiKey, revokeApiKey, toggleKeyVisibility } from '../dashboard/dashboard.slice'
import apikeyService from '../../../services/apikey.service.js'
import { CardSkeleton } from '../../../components/LoadingSkeleton'

export const ApiKeysPage = () => {
  const dispatch = useDispatch()
  const { apiKeys } = useSelector((state) => state.dashboard)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    // Load API keys from backend
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    setLoading(true)
    try {
      const response = await apikeyService.getKeys()
      // Replace mock data with real data
      // dispatch(setApiKeys(response.keys))
    } catch (err) {
      setError('Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateKey = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Please enter a key name')
      return
    }

    setLoading(true)
    try {
      const response = await apikeyService.createKey(formData)
      dispatch(addApiKey(response))
      setFormData({ name: '', description: '' })
      setShowCreateForm(false)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to revoke this key?')) return

    setLoading(true)
    try {
      await apikeyService.revokeKey(keyId)
      dispatch(revokeApiKey(keyId))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyKey = (key, keyId) => {
    navigator.clipboard.writeText(key)
    setCopiedId(keyId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleToggleVisibility = (keyId) => {
    dispatch(toggleKeyVisibility(keyId))
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">API Keys</h2>
            <p className="text-gray-400">Manage your API keys for programmatic access</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
          >
            <Plus size={18} />
            New Key
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-gray-800 border border-gray-700 rounded p-6 mb-6">
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Key Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Production API"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What will you use this key for?"
                rows={3}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded font-medium transition-colors"
              >
                {loading ? 'Creating...' : 'Create Key'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  setFormData({ name: '', description: '' })
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading && !showCreateForm && (
        <div className="space-y-4">
          <CardSkeleton count={3} />
        </div>
      )}

      {/* API Keys List */}
      {!loading && apiKeys.length > 0 && (
        <div className="space-y-4">
          {apiKeys
            .filter((key) => key.active)
            .map((key) => (
              <div key={key.id} className="bg-gray-800 border border-gray-700 rounded p-4 hover:border-gray-600 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{key.name}</h3>
                    <p className="text-sm text-gray-400">
                      Created: {new Date(key.created).toLocaleDateString()}
                    </p>
                    {key.lastUsed && (
                      <p className="text-sm text-gray-400">
                        Last used: {new Date(key.lastUsed).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-2">{key.usage} requests</p>
                    <button
                      onClick={() => handleRevokeKey(key.id)}
                      className="px-3 py-1 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded text-sm transition-colors"
                    >
                      Revoke
                    </button>
                  </div>
                </div>

                {/* Key Display */}
                <div className="bg-gray-900 border border-gray-700 rounded p-3 flex items-center justify-between font-mono text-sm">
                  <span className="text-gray-400 truncate">
                    {key.visible ? key.key : key.key.substring(0, 20) + '...'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleVisibility(key.id)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title={key.visible ? 'Hide' : 'Show'}
                    >
                      {key.visible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => handleCopyKey(key.key, key.id)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Copy"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
                {copiedId === key.id && (
                  <p className="text-xs text-green-400 mt-2">Copied to clipboard!</p>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && apiKeys.filter((k) => k.active).length === 0 && (
        <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded">
          <p className="text-gray-400 mb-4">No active API keys</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
          >
            Create Your First Key
          </button>
        </div>
      )}
    </div>
  )
}

export default ApiKeysPage
