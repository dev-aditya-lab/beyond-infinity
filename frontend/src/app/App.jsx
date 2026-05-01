import { useState, useEffect, useRef } from "react"
import { RouterProvider } from "react-router"
import { Provider } from "react-redux"
import { router } from "./app.routes" 
import { appStore } from "./app.store"
import { AuthProvider } from "../features/auth/context/AuthContext"
import OpsPulseLoader from "../features/shared/Components/OpsPulseLoader"
import gsap from "gsap"
import "./App.css"

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const landingPageRef = useRef(null)

  useEffect(() => {
    // Show loader for at least 3 seconds to allow the boot animation to complete
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Animate landing page entrance when it becomes visible
  useEffect(() => {
    if (isLoaded && landingPageRef.current) {
      // Set initial state (hidden below screen)
      gsap.set(landingPageRef.current, { y: '100%', opacity: 0 });
      
      // Animate entrance from bottom
      gsap.timeline()
        .to(landingPageRef.current, {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'power4.out',
          delay: 0.1 // Small delay after loader fade
        });
    }
  }, [isLoaded])

  if (!isLoaded) {
    return <OpsPulseLoader onComplete={() => setIsLoaded(true)} />
  }

  return (
    <Provider store={appStore}>
      <AuthProvider>
        <div ref={landingPageRef} className="landing-page-container">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </Provider>
  )
}

export default App