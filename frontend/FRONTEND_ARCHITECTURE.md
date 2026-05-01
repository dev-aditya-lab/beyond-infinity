# OpsPulse Frontend - Architecture Guide

## Project Overview

OpsPulse is a modern incident management platform built with React, Redux Toolkit, and Tailwind CSS. The frontend provides a comprehensive dashboard for monitoring, managing, and tracking system incidents.

## Technology Stack

- **React 19.2.5** - UI Framework
- **Redux Toolkit 2.11.2** - State Management
- **React Router 7.14.2** - Client-side Routing
- **Tailwind CSS 4.2.4** - Styling
- **Axios 1.6.2** - HTTP Client
- **Lucide React 1.14.0** - Icon Library
- **Vite 8.0.10** - Build Tool

## Project Structure

```
src/
├── app/
│   ├── App.jsx                 # Root component with ErrorBoundary
│   ├── app.routes.jsx          # Router configuration
│   ├── app.store.jsx           # Redux store setup
│   └── index.css               # Global styles & Tailwind config
├── config/
│   ├── api.js                  # API endpoints configuration
│   └── env.js                  # Environment variables
├── services/
│   ├── apiClient.js            # Axios instance with interceptors
│   ├── auth.service.js         # Authentication API calls
│   ├── incident.service.js     # Incident management API calls
│   └── apikey.service.js       # API key management calls
├── hooks/
│   ├── useAuth.js              # Authentication hook
│   ├── useIncidents.js         # Incidents management hook
│   └── useToast.js             # Toast notifications hook
├── utils/
│   ├── ProtectedRoute.jsx      # Route protection wrapper
│   ├── ErrorBoundary.jsx       # Error handling component
│   └── formUtils.js            # Form validation utilities
├── components/
│   └── LoadingSkeleton.jsx     # Loading skeleton loaders
└── features/
    ├── public-pages/           # Public website pages
    ├── auth/
    │   ├── auth.slice.js       # Redux auth state
    │   └── pages/
    │       ├── Login.jsx       # Login page
    │       └── Signup.jsx      # Signup page
    ├── incidents/
    │   ├── incidents.slice.js  # Redux incidents state
    │   └── pages/
    │       ├── IncidentsList.jsx    # List all incidents
    │       ├── IncidentDetail.jsx   # View/edit incident
    │       └── CreateIncident.jsx   # Create new incident
    └── dashboard/
        ├── dashboard.slice.js  # Redux dashboard state
        ├── pages/
        │   ├── Dashboard.jsx       # Main dashboard
        │   └── ApiKeysPage.jsx     # API keys management
        └── components/         # Dashboard UI components
```

## State Management (Redux)

### Auth Slice (`src/features/auth/auth.slice.js`)
Manages user authentication state:
```javascript
{
  user: null,                 // Current user data
  isAuthenticated: false,     // Authentication status
  loading: false,             // Loading state
  error: null                 // Error messages
}
```

### Incidents Slice (`src/features/incidents/incidents.slice.js`)
Manages incident data and operations:
```javascript
{
  incidents: [],              // List of incidents
  currentIncident: null,      // Currently viewed incident
  loading: false,             // Loading state
  error: null,                // Error messages
  filters: {                  // Applied filters
    status: null,
    severity: null,
    page: 1,
    limit: 20
  },
  total: 0                    // Total incident count
}
```

### Dashboard Slice (`src/features/dashboard/dashboard.slice.js`)
Manages dashboard UI state and API keys:
```javascript
{
  activeView: 'dashboard',    // Current dashboard view
  apiKeys: [],                // User's API keys
  sidebarOpen: false          // Sidebar visibility
}
```

## API Integration

### API Configuration (`src/config/api.js`)
Centralized endpoint configuration:
```javascript
API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  INCIDENTS_LIST: '/incidents',
  // ... more endpoints
}
```

### API Client (`src/services/apiClient.js`)
Axios instance with:
- Request interceptors for token injection
- Response interceptors for error handling
- Automatic 401 redirect on token expiration

### Service Layers
Each domain has its own service layer:
- `auth.service.js` - Login, signup, token management
- `incident.service.js` - CRUD operations for incidents
- `apikey.service.js` - API key management

## Custom Hooks

### useAuth
```javascript
const { user, isAuthenticated, login, signup, logout, error, loading } = useAuth()
```

### useIncidents
```javascript
const { 
  incidents, 
  loading, 
  getIncidents, 
  createIncident, 
  updateIncident,
  deleteIncident 
} = useIncidents()
```

### useToast
```javascript
const { success, error, info, warning } = useToast()
// Usage: toast.success('Operation completed!')
```

## Authentication Flow

1. **Public Pages** → No authentication required
2. **Login/Signup** → Users create account or log in
3. **Protected Routes** → ProtectedRoute wrapper checks authentication
4. **Token Storage** → localStorage stores auth token
5. **API Requests** → Axios interceptors inject token automatically
6. **Token Expiration** → 401 responses redirect to login

## Page Components

### Authentication Pages
- **Login** (`/login`) - User login form
- **Signup** (`/signup`) - User registration form

### Incident Management
- **Incidents List** (`/incidents`) - View all incidents with filtering
- **Incident Detail** (`/incidents/:id`) - View and edit incident
- **Create Incident** (`/incidents/create`) - Create new incident

### Dashboard
- **Dashboard** (`/dashboard`) - Main dashboard with stats
- **API Keys** - Manage API keys within dashboard

## Error Handling

### ErrorBoundary Component
- Wraps entire app to catch runtime errors
- Shows fallback UI with error details (dev mode)
- Provides recovery options

### Toast Notifications
- Success, error, info, and warning types
- Auto-dismiss after 3 seconds
- Manual dismissal option

## Form Validation

Utilities for common validation:
```javascript
validateEmail(email)           // Email format validation
validatePassword(password)     // Password strength check
sanitizeFormData(data)        // Clean and trim form data
getFormErrorMessage(field)    // User-friendly error messages
```

## Environment Configuration

Set in `.env` file:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=OpsPulse
VITE_APP_VERSION=1.0.0
```

Access via `import.meta.env.VITE_*` or through `env` utility.

## Styling

### Tailwind CSS
- Dark theme with black background
- Custom theme variables in `index.css`
- Utility-first approach for components

### Custom Animations
- `fadeUp` - Fade and slide up animation
- `slideIn` - Slide in animation for toasts
- `pulseRing` - Pulse ring animation

## Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Run Dev Server**
   ```bash
   npm run dev
   ```

3. **Make Changes** - Follow atomic commit pattern
   ```bash
   git add -A
   git commit -m "feat(scope): description"
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Key Features

✅ User authentication with JWT tokens  
✅ Incident management (CRUD operations)  
✅ API key management  
✅ Real-time state management with Redux  
✅ Error boundaries and error handling  
✅ Loading skeletons for better UX  
✅ Toast notifications  
✅ Protected routes  
✅ Responsive dark UI  
✅ Form validation  

## Future Enhancements

- [ ] Real-time WebSocket integration for live incident updates
- [ ] Dashboard analytics and charts
- [ ] User role-based access control (RBAC)
- [ ] Incident timeline visualization
- [ ] Search and advanced filtering
- [ ] Export incident data
- [ ] User settings and preferences
- [ ] Dark/Light theme toggle

## Contributing

Follow the established patterns:
1. Create service layers for API calls
2. Use custom hooks for component logic
3. Dispatch Redux actions for state management
4. Add loading and error states
5. Use atomic commits with descriptive messages
6. Test functionality before committing

## Support

For issues or questions, refer to:
- Architecture documentation in this file
- Component documentation in code comments
- API endpoint documentation in `config/api.js`
