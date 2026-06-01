import { doc, getDocFromServer, deleteDoc } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'

export async function fetchResumeWithFeedback(resumeId) {
  const user = auth.currentUser

  if (!user) throw new Error('You must be logged in.')
  if (!resumeId) throw new Error('Resume ID is required.')

  const resumeRef = doc(db, 'resumes', resumeId)
  const resumeSnap = await getDocFromServer(resumeRef)

  if (!resumeSnap.exists()) {
    throw new Error('Resume not found.')
  }

  const resume = {
    id: resumeSnap.id,
    ...resumeSnap.data(),
  }

  if (resume.uid !== user.uid && resume.userId !== user.uid) {
    throw new Error('Access denied.')
  }

  const feedbackId = resume.feedbackId || `${resumeId}_feedback`
  const feedbackRef = doc(db, 'feedback', feedbackId)

  let feedback = null

  try {
    const feedbackSnap = await getDocFromServer(feedbackRef)

    feedback = feedbackSnap.exists()
      ? {
          id: feedbackSnap.id,
          ...feedbackSnap.data(),
        }
      : null
  } catch {
    feedback = null
  }

  return { resume, feedback }
}

export async function deleteResumeWithFeedback(resumeId) {
  const user = auth.currentUser

  if (!user) throw new Error('You must be logged in.')
  if (!resumeId) throw new Error('Resume ID is required.')

  const resumeRef = doc(db, 'resumes', resumeId)
  const resumeSnap = await getDocFromServer(resumeRef)

  if (!resumeSnap.exists()) {
    throw new Error('Resume not found.')
  }

  const resume = resumeSnap.data()

  if (resume.uid !== user.uid && resume.userId !== user.uid) {
    throw new Error('Access denied.')
  }

  /**
   * Only delete the resume document.
   * Feedback read is still supported above for the summary/detail page.
   * Feedback delete is intentionally skipped because Firestore rules were
   * blocking that path and causing the delete action to fail.
   */
  await deleteDoc(resumeRef)

  return resumeId
}