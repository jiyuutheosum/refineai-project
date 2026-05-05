import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
} from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'

/**
 * Save resume draft to Firestore
 * @param {string} resumeId - The resume ID
 * @param {Array} sections - Array of resume sections
 * @returns {Promise<{success: boolean}>}
 */
export async function saveResumeDraft(resumeId, sections) {
  if (!resumeId) {
    throw new Error('Resume ID is required to save draft.')
  }

  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to save drafts.')
  }

  const resumeDocRef = doc(db, 'users', user.uid, 'resumes', resumeId)
  await setDoc(
    resumeDocRef,
    {
      sections,
      lastSaved: new Date().toISOString(),
    },
    { merge: true }
  )

  return { success: true }
}

/**
 * Get resume draft from Firestore
 * @param {string} resumeId - The resume ID
 * @returns {Promise<{sections: Array, lastSaved: string}>}
 */
export async function getResumeDraft(resumeId) {
  if (!resumeId) {
    throw new Error('Resume ID is required to get draft.')
  }

  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to get drafts.')
  }

  const resumeDocRef = doc(db, 'users', user.uid, 'resumes', resumeId)
  const resumeDoc = await getDoc(resumeDocRef)

  if (resumeDoc.exists()) {
    const data = resumeDoc.data()
    return {
      sections: data.sections || [],
      lastSaved: data.lastSaved || null,
    }
  }

  return { sections: [], lastSaved: null }
}

/**
 * Apply AI suggestion to a section
 * This would typically call an AI service
 * @param {string} sectionId - The section ID
 * @param {Object} suggestion - The suggestion object
 * @returns {Promise<{content: string}>}
 */
export async function applySuggestion(sectionId, suggestion) {
  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to apply suggestions.')
  }

  // In a real app, this would call an AI service
  // For now, return a placeholder
  return {
    content: suggestion.suggestedContent || 'Updated content based on AI suggestion',
  }
}

/**
 * Delete a resume
 * @param {string} resumeId - The resume ID
 */
export async function deleteResume(resumeId) {
  if (!resumeId) {
    throw new Error('Resume ID is required to delete.')
  }

  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to delete resumes.')
  }

  const resumeDocRef = doc(db, 'users', user.uid, 'resumes', resumeId)
  await deleteDoc(resumeDocRef)
}

/**
 * Get all resume drafts for the current user
 * @returns {Promise<Array>} Array of resume drafts
 */
export async function getUserDrafts() {
  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to view drafts.')
  }

  const resumesRef = collection(db, 'users', user.uid, 'resumes')
  const q = query(resumesRef, orderBy('lastSaved', 'desc'))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((resume) => resume.sections && resume.sections.length > 0)
}
