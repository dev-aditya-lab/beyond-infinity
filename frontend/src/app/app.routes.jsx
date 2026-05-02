import { createBrowserRouter } from 'react-router'
import Home from '../features/public-pages/pages/Home'
import Dashboard from '../features/dashboard/pages/Dashboard'
import Login from '../features/auth/pages/Login'
import Signup from '../features/auth/pages/Signup'
import OnboardingPage from '../features/auth/pages/OnboardingPage'
import IncidentsList from '../features/incidents/pages/IncidentsList'
import IncidentDetail from '../features/incidents/pages/IncidentDetail'
import CreateIncident from '../features/incidents/pages/CreateIncident'
import ProfilePage from '../features/profile/pages/ProfilePage'
import EmployeesPage from '../features/profile/pages/EmployeesPage'
import OrganizationPage from '../features/profile/pages/OrganizationPage'
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
        path: "/onboarding",
        element: (
            <ProtectedRoute skipOrgCheck>
                <OnboardingPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/incidents",
        element: (
            <ProtectedRoute>
                <IncidentsList />
            </ProtectedRoute>
        ),
    },
    {
        path: "/incidents/create",
        element: (
            <ProtectedRoute>
                <CreateIncident />
            </ProtectedRoute>
        ),
    },
    {
        path: "/incidents/:id",
        element: (
            <ProtectedRoute>
                <IncidentDetail />
            </ProtectedRoute>
        ),
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <ProfilePage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/employees",
        element: (
            <ProtectedRoute>
                <EmployeesPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/organization",
        element: (
            <ProtectedRoute>
                <OrganizationPage />
            </ProtectedRoute>
        ),
    },
])
