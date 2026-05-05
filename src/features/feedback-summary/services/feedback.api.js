import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'

/**
 * Fetch feedback summary for a resume from Firestore
 * @param {string} resumeId - The resume ID
 * @returns {Promise<Object>} Feedback summary data
 */
export async function fetchFeedbackSummary(resumeId) {
  if (!resumeId) {
    throw new Error('Resume ID is required to fetch feedback summary.')
  }

  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to fetch feedback.')
  }

  const feedbackDocRef = doc(db, 'users', user.uid, 'feedback', resumeId)
  const feedbackDoc = await getDoc(feedbackDocRef)

  if (feedbackDoc.exists()) {
    return feedbackDoc.data()
  }

  // If no feedback exists, return default structure
  // In a real app, this would trigger AI analysis
  return {
    overallScore: 0,
    totalIssues: 0,
    strengths: 0,
    improvements: 0,
    categoryScores: [],
    priorityActions: [],
    sectionBreakdowns: [],
    educationalResources: [],
    status: 'pending',
  }
}

/**
 * Save feedback summary to Firestore
 * @param {string} resumeId - The resume ID
 * @param {Object} feedbackData - The feedback data to save
 */
export async function saveFeedbackSummary(resumeId, feedbackData) {
  if (!resumeId) {
    throw new Error('Resume ID is required to save feedback.')
  }

  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to save feedback.')
  }

  const feedbackDocRef = doc(db, 'users', user.uid, 'feedback', resumeId)
  await setDoc(feedbackDocRef, {
    ...feedbackData,
    resumeId,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Export feedback summary
 * @param {string} type - Export type (pdf, json, email)
 * @param {Object} data - The feedback data
 * @param {string} email - Optional email to send to
 */
export async function exportSummary(type, data, email) {
  if (!type) {
    throw new Error('Export type is required.')
  }

  if (!data) {
    throw new Error('Summary data is required for export.')
  }

  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to export feedback.')
  }

  // In a real app, this would trigger a cloud function to generate PDF
  // or send an email. For now, we just return success.
  console.log(`Exporting ${type} for user ${user.uid}`)

  return {
    success: true,
    type,
    email: email || null,
    exportedAt: new Date().toISOString(),
  }
}

/**
 * Get all feedback for the current user
 * @returns {Promise<Array>} Array of feedback documents
 */
export async function getUserFeedback() {
  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to view feedback.')
  }

  const feedbackRef = collection(db, 'users', user.uid, 'feedback')
  const q = query(feedbackRef, orderBy('updatedAt', 'desc'))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}
