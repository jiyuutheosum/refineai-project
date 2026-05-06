import { groqClient } from '@/lib/groq'

export async function analyzeResumeWithGemini(resumeText) {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Resume text is too short to analyze.')
  }

  const completion = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are an expert resume reviewer. Do two things at once and return a single JSON object:

1. REVIEW the resume — score each section and give feedback
2. EXTRACT the resume content — copy exact text per section for editing

Return ONLY this JSON structure, no markdown, no explanation:

{
  "overallScore": <number 0-100>,
  "overallFeedback": "<2-3 sentence summary>",
  "sectionFeedback": [
    {
      "section": "Personal Information",
      "score": <number 0-100>,
      "feedback": "<specific feedback>",
      "suggestions": [
        { "text": "<actionable suggestion>", "severity": "high" | "medium" | "low" }
      ]
    },
    {
      "section": "Professional Summary",
      "score": <number 0-100>,
      "feedback": "<specific feedback>",
      "suggestions": [
        { "text": "<actionable suggestion>", "severity": "high" | "medium" | "low" }
      ]
    },
    {
      "section": "Work Experience",
      "score": <number 0-100>,
      "feedback": "<specific feedback>",
      "suggestions": [
        { "text": "<actionable suggestion>", "severity": "high" | "medium" | "low" }
      ]
    },
    {
      "section": "Education",
      "score": <number 0-100>,
      "feedback": "<specific feedback>",
      "suggestions": [
        { "text": "<actionable suggestion>", "severity": "high" | "medium" | "low" }
      ]
    },
    {
      "section": "Skills",
      "score": <number 0-100>,
      "feedback": "<specific feedback>",
      "suggestions": [
        { "text": "<actionable suggestion>", "severity": "high" | "medium" | "low" }
      ]
    },
    {
      "section": "Seminar & Certifications",
      "score": <number 0-100>,
      "feedback": "<specific feedback>",
      "suggestions": [
        { "text": "<actionable suggestion>", "severity": "high" | "medium" | "low" }
      ]
    }
  ],
  "extractedSections": {
    "personalInfo": "<exact text: name, email, phone, address, linkedin — preserve line breaks>",
    "summary": "<exact professional summary text from resume>",
    "experience": "<exact work experience text — preserve all entries and line breaks>",
    "education": "<exact education text from resume>",
    "skills": "<exact skills text from resume>",
    "seminarsAndCertificates": "<exact certifications and seminars text, empty string if none>"
  }
}

Scoring: 90-100 Exceptional, 75-89 Strong, 60-74 Good, 40-59 Needs work, 0-39 Major issues
Severity: high = critical, medium = should fix, low = nice to have
extractedSections rules: copy EXACT text word for word, preserve \\n line breaks, empty string if section not found

Resume:
---
${resumeText}
---

Return ONLY the JSON object.`,
      },
    ],
    temperature: 0.3,
    max_tokens: 3000,
  })

  const responseText = completion.choices[0]?.message?.content || ''
  const cleaned = responseText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  try {
    const result = JSON.parse(cleaned)

    // Ensure extractedSections always exists even if AI omits it
    if (!result.extractedSections) {
      result.extractedSections = {
        personalInfo: '',
        summary: '',
        experience: '',
        education: '',
        skills: '',
        seminarsAndCertificates: '',
      }
    }

    return result
  } catch {
    throw new Error('AI returned an invalid response. Please try again.')
  }
}

// Keep this as a named export so analysis.api.js import doesn't break
// It now just calls the combined function and returns only the sections
export async function extractResumeSections(resumeText) {
  const result = await analyzeResumeWithGemini(resumeText)
  return result.extractedSections
}