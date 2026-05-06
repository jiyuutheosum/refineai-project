import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { extractTextFromFile } from './textExtractor'
import { analyzeResumeWithGemini } from './AIAnalysis'

export async function runResumeAnalysis({ resumeId, file, uid }) {
  if (!resumeId || !file || !uid) {
    throw new Error('Missing required fields for analysis.')
  }

  // Extract text directly from the File object — no fetch needed
  const resumeText = await extractTextFromFile(file)

  if (!resumeText || resumeText.length < 50) {
    throw new Error('Could not extract text from resume. Make sure the file is not scanned or image-based.')
  }

  const analysis = await analyzeResumeWithGemini(resumeText)

  const feedbackId = `${resumeId}_feedback`
  const feedbackRef = doc(db, 'feedback', feedbackId)

  await setDoc(feedbackRef, {
    uid,
    resumeId,
    feedbackId,
    overallScore: analysis.overallScore,
    overallFeedback: analysis.overallFeedback,
    sectionFeedback: analysis.sectionFeedback,
    createdAt: serverTimestamp(),
  })

  const resumeRef = doc(db, 'resumes', resumeId)
  await setDoc(
    resumeRef,
    {
      analysisStatus: 'completed',
      overallScore: analysis.overallScore,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  return { feedbackId, ...analysis }
}

export async function fetchAnalysisFromFirestore(resumeId) {
  const feedbackRef = doc(db, 'feedback', `${resumeId}_feedback`)
  const snapshot = await getDoc(feedbackRef)
  if (!snapshot.exists()) return null
  return snapshot.data()
}