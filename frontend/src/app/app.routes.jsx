import { createBrowserRouter } from 'react-router'
import Home from '../features/public-pages/pages/Home'
import Dashboard from '../features/dashboard/pages/Dashboard'
import Login from '../features/auth/pages/Login'
import Signup from '../features/auth/pages/Signup'
import ProtectedRoute from '../utils/ProtectedRoute'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
])

