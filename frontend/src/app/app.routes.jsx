import { createBrowserRouter } from 'react-router'
import Home from '../features/public-pages/pages/Home'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
])

