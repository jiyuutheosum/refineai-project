/**
 * @file src/features/resume-analysis/services/AIAnalysis.js
 *
 * IMPORTANT: This module now proxies through our secure backend.
 * All expensive AI calls (Groq / future xAI) happen server-side with proper rate limiting.
 *
 * The old direct browser Groq client has been removed for security and cost protection.
 */

import { aiApi } from '@/lib/backendApi'

const EMPTY_SECTIONS = {
  personalInfo: '',
  summary: '',
  experience: '',
  education: '',
  skills: '',
  seminarsAndCertificates: '',
}

/**
 * Analyzes a resume by calling the backend.
 * The backend handles authentication, rate limiting, and the actual AI call.
 */
export async function analyzeResumeWithGemini(resumeText) {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Resume text is too short to analyze.')
  }

  try {
    const analysis = await aiApi.analyzeResume(resumeText)

    // Ensure we always return the expected shape
    return {
      overallScore: Number(analysis.overallScore) || 0,
      overallFeedback: analysis.overallFeedback || '',
      sectionFeedback: Array.isArray(analysis.sectionFeedback)
        ? analysis.sectionFeedback
        : [],
      extractedSections: {
        ...EMPTY_SECTIONS,
        ...(analysis.extractedSections || {}),
      },
    }
  } catch (error) {
    // Re-throw with consistent messaging for the rest of the app
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      throw error // Let UI handle rate limit specially if needed
    }
    throw new Error(error.message || 'AI analysis failed. Please try again.')
  }
}

export async function extractResumeSections(resumeText) {
  const result = await analyzeResumeWithGemini(resumeText)
  return result.extractedSections
}
