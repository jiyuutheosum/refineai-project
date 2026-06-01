import { groqClient } from '@/lib/groq'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'

export async function generateMockInterviewQuestions(resumeText, targetJobRole = '') {
  if (!resumeText || resumeText.trim().length < 100) {
    throw new Error('Resume content is too short to generate meaningful interview questions.')
  }

  const systemPrompt = `You are an expert technical and behavioral interviewer with 15+ years of experience hiring for software engineering, product, and business roles.

Your job is to generate high-quality, realistic interview questions tailored to the candidate's actual experience and background from their resume.

Focus on:
- Behavioral questions using STAR method based on real projects/experience
- Technical questions based on the technologies and skills listed
- Questions that probe depth (not just surface level)
- Questions that a real interviewer would ask after reading this specific resume

Return ONLY valid JSON. No markdown, no explanations.`

  const userPrompt = `
Based on this resume${targetJobRole ? ` and targeting the role of "${targetJobRole}"` : ''}, generate 12 strong interview questions.

Resume:
${resumeText}

Return this exact JSON format:

{
  "questions": [
    {
      "id": 1,
      "category": "Behavioral" | "Technical" | "Situational" | "Role-Specific",
      "question": "The actual interview question",
      "why_asked": "Brief explanation of why an interviewer would ask this based on the resume (1 sentence)",
      "suggested_talking_points": ["Point 1", "Point 2", "Point 3"]
    }
  ]
}

Guidelines:
- Mix of 4-5 Behavioral, 4-5 Technical, 2-3 Role-Specific or Situational
- Questions must be directly relevant to the experience and skills in the resume
- Avoid generic questions that could apply to anyone
- Make questions challenging but fair
- suggested_talking_points should help the candidate structure a strong answer
`

  const completion = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: "json_object" },
  })

  const content = completion.choices[0]?.message?.content

  if (!content) {
    throw new Error('Failed to generate interview questions.')
  }

  try {
    const parsed = JSON.parse(content)
    return parsed.questions || []
  } catch (e) {
    throw new Error('Failed to parse interview questions from AI response.')
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
