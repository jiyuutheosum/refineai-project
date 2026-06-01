import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  logOut,
} from '../services/auth.service'

// Async thunks for authentication
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const user = await signInWithGoogle()
      const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com')

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        isGoogleUser,
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await signInWithEmail(email, password)
      const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com')

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        isGoogleUser,
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const registerWithEmailAsync = createAsyncThunk(
  'auth/registerWithEmail',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const user = await registerWithEmail(email, password, displayName)
      const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com')

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        isGoogleUser,
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logOut()
      return null
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Initial state
const initialState = {
  user: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.status = 'succeeded'
    },
    clearError: (state) => {
      state.error = null
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      // Login with Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        state.error = null
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Login with Email
      .addCase(loginWithEmail.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        state.error = null
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Register with Email
      .addCase(registerWithEmailAsync.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerWithEmailAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        state.error = null
      })
      .addCase(registerWithEmailAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle'
        state.user = null
        state.error = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { setUser, clearError } = authSlice.actions

export default authSlice.reducer
