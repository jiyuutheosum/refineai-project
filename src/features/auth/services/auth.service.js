import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

const googleProvider = new GoogleAuthProvider()

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Create or update user document in Firestore
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
      })
    }

    return user
  } catch (error) {
    throw new Error(getAuthErrorMessage(error))
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    throw new Error(getAuthErrorMessage(error))
  }
}

/**
 * Register with email and password
 */
export async function registerWithEmail(email, password, displayName) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const user = result.user

    // Create user document in Firestore
    const userDocRef = doc(db, 'users', user.uid)
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || email.split('@')[0],
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
    })

    return user
  } catch (error) {
    throw new Error(getAuthErrorMessage(error))
  }
}

/**
 * Log out
 */
export async function logOut() {
  try {
    await signOut(auth)
  } catch (error) {
    throw new Error(getAuthErrorMessage(error))
  }
}

/**
 * Get user-friendly error message
 */
function getAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.'
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.'
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.'
    case 'auth/invalid-email':
      return 'Invalid email address. Please check and try again.'
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed. Please contact support.'
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/user-not-found':
      return 'No account found with this email. Please register first.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.'
    default:
      return error.message || 'An unexpected error occurred. Please try again.'
  }
}
