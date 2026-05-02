import { useEffect, useState } from 'react'
import { RouterProvider } from "react-router"
import { Provider } from "react-redux"
import { router } from "./app.routes" 
import { appStore } from "./app.store"
import authService from '../services/auth.service.js'
import { setUser, logout as logoutAction } from '../features/auth/auth.slice.js'
import ErrorBoundary from "../utils/ErrorBoundary"

const AuthBootstrap = ({ children }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const syncSession = async () => {
      const token = authService.getToken()

      if (!token) {
        if (!cancelled) setReady(true)
        return
      }

      try {
        const userData = await authService.getCurrentUserFromBackend()
        appStore.dispatch(setUser(userData))
      } catch (error) {
        appStore.dispatch(logoutAction())
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    syncSession()

    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) return null

  return children
}

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={appStore}>
        <AuthBootstrap>
          <RouterProvider router={router} />
        </AuthBootstrap>
      </Provider>
    </ErrorBoundary>
  )
}

export default App