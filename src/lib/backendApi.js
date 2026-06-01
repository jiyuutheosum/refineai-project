/**
 * @file src/lib/backendApi.js
 * @description Centralized client for calling the RefineAI backend (Express).
 * 
 * Handles:
 * - Firebase Auth ID token injection
 * - Base URL configuration via VITE_BACKEND_URL
 * - Consistent error handling
 *
 * The backend enforces rate limiting + runs the actual (expensive) AI calls server-side.
 */

import axios from 'axios'
import { auth } from '@/lib/firebase'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // AI calls can be slow (up to 2 minutes)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach fresh Firebase ID token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser
    if (user) {
      try {
        const token = await user.getIdToken()
        config.headers.Authorization = `Bearer ${token}`
      } catch (err) {
        // Silent fail — backend will return 401 if token is missing
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for consistent error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      // Surface rate limit errors nicely
      if (status === 429) {
        const message = data?.message || 'You have reached your daily AI usage limit.'
        const err = new Error(message)
        err.code = 'RATE_LIMIT_EXCEEDED'
        err.status = 429
        err.details = data
        return Promise.reject(err)
      }

      // Auth errors
      if (status === 401) {
        const err = new Error(data?.message || 'Authentication required. Please sign in again.')
        err.code = 'UNAUTHORIZED'
        err.status = 401
        return Promise.reject(err)
      }

      const message = data?.message || data?.error || 'Request failed'
      const err = new Error(message)
      err.status = status
      err.details = data
      return Promise.reject(err)
    }

    // Network / timeout
    if (error.code === 'ECONNABORTED') {
      const err = new Error('The request timed out. AI processing can take up to 2 minutes.')
      err.code = 'TIMEOUT'
      return Promise.reject(err)
    }

    return Promise.reject(error)
  }
)

export default api

/**
 * Convenience helpers for AI endpoints
 */
export const aiApi = {
  /**
   * Analyze a resume using the backend (rate limited + secure)
   */
  async analyzeResume(resumeText) {
    const { data } = await api.post('/api/ai/analyze-resume', { resumeText })
    return data.analysis || data // support both shapes
  },

  /**
   * Generate mock interview questions (rate limited)
   */
  async generateMockInterview(resumeText, targetRole = '') {
    const { data } = await api.post('/api/ai/generate-mock-interview', {
      resumeText,
      targetRole,
    })
    return data.questions || []
  },

  /**
   * Get current user's AI usage (for UI feedback)
   */
  async getUsage() {
    const { data } = await api.get('/api/ai/usage')
    return data
  },
}
