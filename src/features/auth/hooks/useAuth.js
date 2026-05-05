import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setUser } from '../store/authSlice'
import { auth } from '@/lib/firebase'

const googleProvider = new GoogleAuthProvider()

/**
 * Custom hook for authentication state
 * Subscribes to Firebase Auth state and syncs to Redux
 */
function useAuth() {
  const dispatch = useAppDispatch()
  const { user, status, error } = useAppSelector((state) => state.auth)
  
  // Track Firebase initialization state
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Mark as not initializing after first response
      setIsInitializing(false)
      
      if (firebaseUser) {
        // Sync user to Redux store
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          })
        )
      } else {
        dispatch(setUser(null))
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [dispatch])

  // Login functions
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (err) {
      throw err
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      throw err
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    isInitializing,
    isLoading: status === 'loading',
    error,
    login,
    logout,
  }
}

export { useAuth }
export default useAuth
