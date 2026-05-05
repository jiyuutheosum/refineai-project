import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

/**
 * AuthGuard component
 * Protects routes by redirecting unauthenticated users to login
 */
function AuthGuard({ children }) {
  const location = useLocation()
  const { user, isAuthenticated, isInitializing } = useAuth()

  // If Firebase is still initializing, return null (don't redirect)
  if (isInitializing) {
    return null
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // User is authenticated, render children
  return <>{children}</>
}

export default AuthGuard
