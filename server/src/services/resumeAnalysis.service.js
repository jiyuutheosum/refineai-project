/**
 * @file server/src/services/resumeAnalysis.service.js
 * @description Service responsible for resume analysis using Groq.
 * 
 * This centralizes all AI logic for resume analysis, including:
 * - Input validation & sanitization
 * - Prompt construction
 * - Groq API call
 * - Response parsing & normalization
 * 
 * Benefits:
 * - Routes stay thin (HTTP concerns only)
 * - Easier to test in isolation
 * - Easier to swap AI providers later
 */

import Groq from 'groq-sdk';

// Server-side only Groq client
let groq;

export function getGroqClient() {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ_API_KEY");
    }

    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }

  return groq;
}

const groq = getGroqClient();

/**
 * Validates and sanitizes resume text input.
 * Includes basic protection against prompt injection.
 */
function validateAndSanitizeResumeText(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Resume text is required.' };
  }

  let sanitized = text.trim();

  if (sanitized.length < 50) {
    return { valid: false, error: 'Resume text is too short. Minimum 50 characters required.' };
  }

  if (sanitized.length > 15000) {
    return { valid: false, error: 'Resume text is too long. Maximum 15,000 characters allowed.' };
  }

  // Basic prompt injection defense
  sanitized = sanitized
    .replace(/ignore (previous|all) instructions?/gi, '[REDACTED]')
    .replace(/system\s*:/gi, '[REDACTED]')
    .replace(/you are (now|an?)/gi, '[REDACTED]')
    .replace(/\s{3,}/g, '  '); // collapse whitespace

  return { valid: true, sanitized };
}

/**
 * Calls Groq to analyze a resume.
 * @param {string} resumeText
 * @returns {Promise<object>} Normalized analysis result
 */
export async function analyzeResume(resumeText) {
  const validation = validateAndSanitizeResumeText(resumeText);

  if (!validation.valid) {
    const error = new Error(validation.error);
    error.code = 'VALIDATION_ERROR';
    error.status = 400;
    throw error;
  }

  const sanitizedText = validation.sanitized;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are a strict resume evaluator. Score based only on the provided resume text. Do not give generous default scores. Penalize missing, vague, weak, or incomplete sections.',
      },
      {
        role: 'user',
        content: `Return ONLY valid JSON. No markdown.

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
  "sectionFeedback": [ { "section": "Personal Information", "score": 0, "feedback": "", "suggestions": [{ "text": "", "severity": "high" }] }, ... ],
  "extractedSections": { "personalInfo": "", "summary": "", "experience": "", "education": "", "skills": "", "seminarsAndCertificates": "" }
}

Resume:
---
${sanitizedText}
---
`,
      },
    ],
    temperature: 0,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  });

  const responseText = completion.choices[0]?.message?.content || '';

  let parsed;
  try {
    parsed = JSON.parse(responseText);
  } catch (e) {
    const error = new Error('AI returned an invalid JSON response. Please try again.');
    error.code = 'AI_PARSE_ERROR';
    error.status = 502;
    throw error;
  }

  return {
    overallScore: Number(parsed.overallScore) || 0,
    overallFeedback: parsed.overallFeedback || '',
    sectionFeedback: Array.isArray(parsed.sectionFeedback) ? parsed.sectionFeedback : [],
    extractedSections: parsed.extractedSections || {},
  };
}
