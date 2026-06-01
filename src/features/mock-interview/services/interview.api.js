/**
 * @file src/features/mock-interview/services/interview.api.js
 *
 * AI generation now goes through our secure backend (with rate limiting + per-user quotas).
 * The actual Groq/xAI call happens server-side.
 */

import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { aiApi } from '@/lib/backendApi'

export async function generateMockInterviewQuestions(resumeText, targetJobRole = '') {
  if (!resumeText || resumeText.trim().length < 100) {
    throw new Error('Resume content is too short to generate meaningful interview questions.')
  }

  try {
    const questions = await aiApi.generateMockInterview(resumeText, targetJobRole)
    return Array.isArray(questions) ? questions : []
  } catch (error) {
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      throw error
    }
    throw new Error(error.message || 'Failed to generate interview questions. Please try again.')
  }
}

/**
 * Persists generated mock interview questions to the resume document.
 * Stored as `mockQuestions` + `mockQuestionsGeneratedAt` (denormalized for easy access via existing resume loads).
 */
export async function saveMockInterviewQuestions(resumeId, questions) {
  if (!resumeId) {
    throw new Error('Resume ID is required to save mock questions.')
  }
  if (!Array.isArray(questions) || questions.length === 0) {
    return // nothing to save
  }

  const user = auth.currentUser
  if (!user) throw new Error('You must be logged in to save mock interview questions.')

  const resumeRef = doc(db, 'resumes', resumeId)

  await setDoc(
    resumeRef,
    {
      mockQuestions: questions,
      mockQuestionsGeneratedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}
