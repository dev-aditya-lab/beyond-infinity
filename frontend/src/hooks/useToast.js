/**
 * Toast Notification Component
 * Simple notification system for user feedback
 */

import { useState, useCallback } from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

const toastTypes = {
  success: { bg: 'bg-green-900/20', border: 'border-green-700/50', icon: CheckCircle, color: 'text-green-400' },
  error: { bg: 'bg-red-900/20', border: 'border-red-700/50', icon: AlertCircle, color: 'text-red-400' },
  info: { bg: 'bg-blue-900/20', border: 'border-blue-700/50', icon: Info, color: 'text-blue-400' },
  warning: { bg: 'bg-yellow-900/20', border: 'border-yellow-700/50', icon: AlertCircle, color: 'text-yellow-400' },
}

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = Date.now()
      const toast = { id, message, type }

      setToasts((prev) => [...prev, toast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    []
  )

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast])
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast])
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast])
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
}

/**
 * Toast Container Component
 * Displays all active toasts
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 pointer-events-none">
      {toasts.map((toast) => {
        const toastStyle = toastTypes[toast.type] || toastTypes.info
        const Icon = toastStyle.icon

        return (
          <div
            key={toast.id}
            className={`${toastStyle.bg} ${toastStyle.border} border rounded p-4 flex items-center gap-3 pointer-events-auto max-w-sm animate-slide-in`}
          >
            <Icon size={20} className={toastStyle.color} />
            <p className={`${toastStyle.color} text-sm flex-1`}>{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`${toastStyle.color} hover:opacity-80 transition-opacity`}
            >
              <X size={18} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default useToast
