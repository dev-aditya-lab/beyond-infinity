import { createBrowserRouter } from 'react-router'
import Home from '../features/public-pages/pages/Home'
import Dashboard from '../features/dashboard/pages/Dashboard'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
])

