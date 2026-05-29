import { groqClient } from '@/lib/groq'

const EMPTY_SECTIONS = {
  personalInfo: '',
  summary: '',
  experience: '',
  education: '',
  skills: '',
  seminarsAndCertificates: '',
}

export async function analyzeResumeWithGemini(resumeText) {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Resume text is too short to analyze.')
  }

  const completion = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content:
          'You are a strict resume evaluator. Score based only on the provided resume text. Do not give generous default scores. Penalize missing, vague, weak, or incomplete sections.',
      },
      {
        role: 'user',
        content: `
Return ONLY valid JSON. No markdown.

Evaluate this resume using this strict rubric:

Overall score:
- 90-100: exceptional resume with measurable impact, strong formatting, complete sections
- 75-89: strong resume but still has minor improvements
- 60-74: decent resume with clear missing details or weak impact
- 40-59: incomplete or weak resume
- 0-39: major issues, missing key sections, or very little usable content

Important scoring rules:
- Do NOT anchor around 80.
- If work experience has no metrics/results, cap Work Experience at 75.
- If professional summary is generic or missing, cap Summary at 65.
- If skills are generic or not role-specific, cap Skills at 70.
- If certifications/seminars are missing, score that section 40-55.
- Overall score must reflect the section scores.
- Use varied realistic scores based on the actual resume quality.

Return this exact JSON shape:

{
  "overallScore": 0,
  "overallFeedback": "",
  "sectionFeedback": [
    {
      "section": "Personal Information",
      "score": 0,
      "feedback": "",
      "suggestions": [
        { "text": "", "severity": "high" }
      ]
    },
    {
      "section": "Professional Summary",
      "score": 0,
      "feedback": "",
      "suggestions": [
        { "text": "", "severity": "medium" }
      ]
    },
    {
      "section": "Work Experience",
      "score": 0,
      "feedback": "",
      "suggestions": [
        { "text": "", "severity": "high" }
      ]
    },
    {
      "section": "Education",
      "score": 0,
      "feedback": "",
      "suggestions": [
        { "text": "", "severity": "medium" }
      ]
    },
    {
      "section": "Skills",
      "score": 0,
      "feedback": "",
      "suggestions": [
        { "text": "", "severity": "medium" }
      ]
    },
    {
      "section": "Seminar & Certifications",
      "score": 0,
      "feedback": "",
      "suggestions": [
        { "text": "", "severity": "low" }
      ]
    }
  ],
  "extractedSections": {
    "personalInfo": "",
    "summary": "",
    "experience": "",
    "education": "",
    "skills": "",
    "seminarsAndCertificates": ""
  }
}

Resume:
---
${resumeText}
---
`,
      },
    ],
    temperature: 0,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  })

  const responseText = completion.choices[0]?.message?.content || ''

  try {
    const result = JSON.parse(responseText)

    return {
      overallScore: Number(result.overallScore) || 0,
      overallFeedback: result.overallFeedback || '',
      sectionFeedback: Array.isArray(result.sectionFeedback)
        ? result.sectionFeedback
        : [],
      extractedSections: {
        ...EMPTY_SECTIONS,
        ...(result.extractedSections || {}),
      },
    }
  } catch {
    throw new Error('AI returned an invalid response. Please try again.')
  }
}

export async function extractResumeSections(resumeText) {
  const result = await analyzeResumeWithGemini(resumeText)
  return result.extractedSections
}