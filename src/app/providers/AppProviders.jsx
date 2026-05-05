import ReduxProvider from './ReduxProvider'
import AppRoutes from '../router/Routes'
import useAuth from '../../features/auth/hooks/useAuth'

// Inner component that uses useAuth hook
function AppWithAuth() {
  // This line subscribes to Firebase auth state
  useAuth()
  
  return <AppRoutes />
}

function AppProviders() {
  return (
    <ReduxProvider>
      <AppWithAuth />
    </ReduxProvider>
  )
}

export default AppProviders
