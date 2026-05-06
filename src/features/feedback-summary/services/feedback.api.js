import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'

export async function fetchFeedbackSummary(resumeId) {
  if (!resumeId) throw new Error('Resume ID is required.')

  const user = auth.currentUser
  if (!user) throw new Error('You must be logged in to fetch feedback.')

  const feedbackDocRef = doc(db, 'feedback', `${resumeId}_feedback`)
  const feedbackDoc = await getDoc(feedbackDocRef)

  if (feedbackDoc.exists()) {
    return feedbackDoc.data()
  }

  // Return default structure if no feedback yet
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

export async function saveFeedbackSummary(resumeId, feedbackData) {
  if (!resumeId) throw new Error('Resume ID is required.')

  const user = auth.currentUser
  if (!user) throw new Error('You must be logged in to save feedback.')

  const feedbackDocRef = doc(db, 'feedback', `${resumeId}_feedback`)
  await setDoc(feedbackDocRef, {
    ...feedbackData,
    uid: user.uid,
    resumeId,
    updatedAt: new Date().toISOString(),
  })
}

export async function exportSummary(type, data, email) {
  if (!type) throw new Error('Export type is required.')
  if (!data) throw new Error('Summary data is required.')

  const user = auth.currentUser
  if (!user) throw new Error('You must be logged in to export feedback.')

  return {
    success: true,
    type,
    email: email || null,
    exportedAt: new Date().toISOString(),
  }
}

export async function getUserFeedback() {
  const user = auth.currentUser
  if (!user) throw new Error('You must be logged in to view feedback.')

  const feedbackRef = collection(db, 'feedback')
  const q = query(
    feedbackRef,
    where('uid', '==', user.uid),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}