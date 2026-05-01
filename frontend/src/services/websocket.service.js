import API_BASE_URL from '../config/api.js'

/**
 * WebSocket Service
 * Handles real-time communication with backend
 * Used for live incident updates and notifications
 */
class WebSocketService {
  constructor() {
    this.ws = null
    this.messageHandlers = new Map()
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        const wsURL = API_BASE_URL.replace(/^http/, 'ws').replace(/\/api$/, '')
        this.ws = new WebSocket(wsURL)
        this.ws.onopen = () => {
          this.isConnected = true
          this.reconnectAttempts = 0
          console.log('WebSocket connected')
          resolve()
        }
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err)
          }
        }
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }
        this.ws.onclose = () => {
          this.isConnected = false
          console.log('WebSocket disconnected')
          this.attemptReconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnected = false
  }

  subscribe(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type).push(handler)
  }

  unsubscribe(type, handler) {
    if (this.messageHandlers.has(type)) {
      const handlers = this.messageHandlers.get(type)
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  send(type, data = {}) {
    if (!this.isConnected) {
      console.warn('WebSocket is not connected')
      return
    }
    const message = {
      type,
      data,
      timestamp: Date.now(),
    }
    this.ws.send(JSON.stringify(message))
  }

  handleMessage(message) {
    const { type, data } = message
    if (this.messageHandlers.has(type)) {
      this.messageHandlers.get(type).forEach((handler) => {
        try {
          handler(data)
        } catch (err) {
          console.error(`Error in handler for type ${type}:`, err)
        }
      })
    }
    if (this.messageHandlers.has('message')) {
      this.messageHandlers.get('message').forEach((handler) => {
        try {
          handler(message)
        } catch (err) {
          console.error('Error in generic message handler:', err)
        }
      })
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      setTimeout(() => {
        this.connect().catch((err) => {
          console.error('Reconnection failed:', err)
        })
      }, this.reconnectDelay)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }
}

export const wsService = new WebSocketService()
export default wsService
