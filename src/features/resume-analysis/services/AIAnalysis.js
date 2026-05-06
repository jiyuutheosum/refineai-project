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
        content: `You are an expert resume reviewer and career coach. Analyze the following resume and return ONLY a valid JSON object with no markdown, no code blocks, no explanation — just raw JSON.

The JSON must follow this exact structure:
{
  "overallScore": <number 0-100>,
  "overallFeedback": "<2-3 sentence summary of the resume>",
  "sectionFeedback": [
    {
      "section": "Contact Information",
      "score": <number 0-100>,
      "feedback": "<specific feedback for this section>",
      "suggestions": [
        { "text": "<actionable suggestion>", "severity": "low" | "medium" | "high" }
      ]
    },
    {
      "section": "Professional Summary",
      "score": <number 0-100>,
      "feedback": "<specific feedback>",
      "suggestions": [
        { "text": "<actionable suggestion>", "severity": "low" | "medium" | "high" }
      ]
    },
    {
      "section": "Work Experience",
      "score": <number 0-100>,
      "feedback": "<specific feedback>",
      "suggestions": [
        { "text": "<actionable suggestion>", "severity": "low" | "medium" | "high" }
      ]
    },
    {
      "section": "Education",
      "score": <number 0-100>,
      "feedback": "<specific feedback>",
      "suggestions": [
        { "text": "<actionable suggestion>", "severity": "low" | "medium" | "high" }
      ]
    },
    {
      "section": "Skills",
      "score": <number 0-100>,
      "feedback": "<specific feedback>",
      "suggestions": [
        { "text": "<actionable suggestion>", "severity": "low" | "medium" | "high" }
      ]
    }
  ]
}

Scoring guide:
- 90-100: Exceptional
- 75-89: Strong
- 60-74: Good foundation
- 40-59: Needs work
- 0-39: Major issues

Severity: high = critical, medium = should fix, low = nice to have

Resume to analyze:
---
${resumeText}
---

Return ONLY the JSON object. No markdown. No explanation. No code blocks.`,
      },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  })

  const responseText = completion.choices[0]?.message?.content || ''

  const cleaned = responseText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    throw new Error('AI returned an invalid response. Please try again.')
  }
}