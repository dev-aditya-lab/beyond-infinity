/**
 * useWebSocket Hook
 * Simplified WebSocket integration for components
 * Automatically manages connection lifecycle
 */

import { useEffect, useCallback } from 'react'
import { wsService } from '../services/websocket.service.js'

export const useWebSocket = () => {
  /**
   * Subscribe to WebSocket events
   */
  const subscribe = useCallback((type, handler) => {
    try {
      wsService.subscribe(type, handler)
      return () => wsService.unsubscribe(type, handler)
    } catch (err) {
      console.warn('WebSocket subscription failed:', err)
      return () => {}
    }
  }, [])

  /**
   * Send WebSocket message
   */
  const send = useCallback((type, data) => {
    try {
      wsService.send(type, data)
    } catch (err) {
      console.warn('WebSocket send failed:', err)
    }
  }, [])

  /**
   * Check if WebSocket is connected
   */
  const isConnected = useCallback(() => {
    return wsService.isConnected
  }, [])

  // Auto-connect on component mount
  useEffect(() => {
    if (!wsService.isConnected) {
      wsService.connect().catch((err) => {
        console.warn('WebSocket connection failed (will retry):', err)
      })
    }

    return () => {
      // Don't disconnect on unmount - let it persist for other components
    }
  }, [])

  return {
    subscribe,
    send,
    isConnected: wsService.isConnected,
  }
}

export default useWebSocket
