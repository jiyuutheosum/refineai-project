import { useState, useEffect } from 'react'
import ReduxProvider from './ReduxProvider'
import AppRoutes from '../router/Routes'
import useAuth from '../../features/auth/hooks/useAuth'
import VerifyEmailModal from '../../features/auth/components/VerifyEmailModal'

// Inner component that uses useAuth hook
function AppWithAuth() {
  const { user } = useAuth()
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  // Show verification modal for email/password users who haven't verified yet
  useEffect(() => {
    if (user && !user.emailVerified && !user.isGoogleUser) {
      // Small delay so it doesn't feel too aggressive on initial load
      const timer = setTimeout(() => {
        setShowVerifyModal(true)
      }, 800)

      return () => clearTimeout(timer)
    } else {
      setShowVerifyModal(false)
    }
  }, [user])

  const handleCloseVerifyModal = () => {
    setShowVerifyModal(false)
  }

  return (
    <>
      <AppRoutes />
      <VerifyEmailModal
        isOpen={showVerifyModal}
        onClose={handleCloseVerifyModal}
        userEmail={user?.email}
      />
    </>
  )
}

function AppProviders() {
  return (
    <ReduxProvider>
      <AppWithAuth />
    </ReduxProvider>
  )
}

export default AppProviders
