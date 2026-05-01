import { RouterProvider } from "react-router"
import { Provider } from "react-redux"
import { router } from "./app.routes" 
import { appStore } from "./app.store"
import ErrorBoundary from "../utils/ErrorBoundary"

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={appStore}>
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  )
}

export default App