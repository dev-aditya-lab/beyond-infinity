import { RouterProvider } from "react-router"
import { Provider } from "react-redux"
import { router } from "./app.routes" 
import { appStore } from "./app.store"

const App = () => {
  return (
    <Provider store={appStore}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App