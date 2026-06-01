/**
 * @file server/src/services/mockInterview.service.js
 * @description Service responsible for generating mock interview questions using Groq.
 * 
 * Centralized AI logic for mock interview generation with:
 * - Strict input validation
 * - Prompt construction
 * - Groq API call
 * - Response normalization
 */

import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY,
});

/**
 * Validates resume text and optional target role.
 * Includes basic protection against prompt injection.
 */
function validateInputs(resumeText, targetRole) {
  if (!resumeText || typeof resumeText !== 'string') {
    return { valid: false, error: 'Resume text is required.' };
  }

  let sanitizedResume = resumeText.trim();

  if (sanitizedResume.length < 100) {
    return { valid: false, error: 'Resume text is too short for meaningful questions. Minimum 100 characters.' };
  }

  if (sanitizedResume.length > 12000) {
    return { valid: false, error: 'Resume text is too long. Maximum 12,000 characters allowed.' };
  }

  // Basic prompt injection defense
  sanitizedResume = sanitizedResume
    .replace(/ignore (previous|all) instructions?/gi, '[REDACTED]')
    .replace(/system\s*:/gi, '[REDACTED]')
    .replace(/you are (now|an?)/gi, '[REDACTED]')
    .replace(/\s{3,}/g, '  ');

  let sanitizedRole = '';
  if (targetRole && typeof targetRole === 'string') {
    sanitizedRole = targetRole.trim().slice(0, 100);
  }

  return {
    valid: true,
    sanitizedResume,
    sanitizedRole,
  };
}

/**
 * Generates mock interview questions.
 */
export async function generateMockQuestions(resumeText, targetRole = '') {
  const validation = validateInputs(resumeText, targetRole);

  if (!validation.valid) {
    const error = new Error(validation.error);
    error.code = 'VALIDATION_ERROR';
    error.status = 400;
    throw error;
  }

  const { sanitizedResume, sanitizedRole } = validation;

  const systemPrompt = `You are an expert technical and behavioral interviewer with 15+ years of experience hiring for software engineering, product, and business roles.

Your job is to generate high-quality, realistic interview questions tailored to the candidate's actual experience and background from their resume.

Focus on:
- Behavioral questions using STAR method based on real projects/experience
- Technical questions based on the technologies and skills listed
- Questions that probe depth (not just surface level)
- Questions that a real interviewer would ask after reading this specific resume

Return ONLY valid JSON. No markdown, no explanations.`;

  const userPrompt = `
Based on this resume${sanitizedRole ? ` and targeting the role of "${sanitizedRole}"` : ''}, generate 12 strong interview questions.

Resume:
${sanitizedResume}

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
`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '';

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    const error = new Error('AI returned an invalid response format.');
    error.code = 'AI_PARSE_ERROR';
    error.status = 502;
    throw error;
  }

  return Array.isArray(parsed.questions) ? parsed.questions : [];
}
