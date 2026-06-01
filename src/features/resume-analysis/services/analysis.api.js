import { doc, setDoc, getDoc, getDocFromServer, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { extractTextFromFile } from './textExtractor'
import { analyzeResumeWithGemini } from './AIAnalysis'

export async function runResumeAnalysis({ resumeId, file, uid, resumeText }) {
  const user = auth.currentUser

  if (!user) throw new Error('You must be logged in.')
  if (!resumeId) {
    throw new Error('Missing resume ID for analysis.')
  }

  const ownerUid = uid || user.uid

  if (ownerUid !== user.uid) {
    throw new Error('Access denied.')
  }

  const textToAnalyze = resumeText || (file ? await extractTextFromFile(file) : '')

  if (!textToAnalyze || textToAnalyze.trim().length < 50) {
    throw new Error(
      'Could not extract enough resume text for analysis. Please upload a readable resume or save edited resume content first.'
    )
  }

  const analysis = await analyzeResumeWithGemini(textToAnalyze)

  const feedbackId = `${resumeId}_feedback`
  const feedbackRef = doc(db, 'feedback', feedbackId)

  await setDoc(feedbackRef, {
    uid: user.uid,
    userId: user.uid,
    resumeId,
    feedbackId,
    overallScore: analysis.overallScore,
    overallFeedback: analysis.overallFeedback,
    sectionFeedback: analysis.sectionFeedback,
    extractedSections: analysis.extractedSections,
    sourceText: textToAnalyze,
    sourceType: resumeText ? 'manual_edit' : 'uploaded_file',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const resumeRef = doc(db, 'resumes', resumeId)

  await setDoc(
    resumeRef,
    {
      analysisStatus: 'completed',
      overallScore: analysis.overallScore,
      feedbackId,
      lastAnalyzedFrom: resumeText ? 'manual_edit' : 'uploaded_file',
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  return {
    feedbackId,
    ...analysis,
  }
}

export async function fetchAnalysisFromFirestore(resumeId) {
  const user = auth.currentUser

  if (!user) return null
  if (!resumeId) return null

  const feedbackRef = doc(db, 'feedback', `${resumeId}_feedback`)

  try {
    const snapshot = await getDocFromServer(feedbackRef)

    if (!snapshot.exists()) return null

    const feedback = snapshot.data()

    if (feedback.uid !== user.uid && feedback.userId !== user.uid) {
      return null
    }

    return feedback
  } catch (error) {
    if (error.code === 'permission-denied') {
      return null
    }

    throw error
  }
}