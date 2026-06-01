/**
 * @file src/lib/groq.js
 *
 * ⚠️ DEPRECATED FOR CLIENT-SIDE USE
 *
 * All AI calls (Groq / xAI) now go through the backend at /api/ai/*
 * for security, rate limiting, and to protect API keys.
 *
 * This file is kept only for potential future server-side reference
 * or one-off scripts. Do not import `groqClient` from the browser.
 *
 * The dangerous browser flag has been removed.
 */

// import Groq from 'groq-sdk'   // Only use on server now

// export const groqClient = new Groq({
//   apiKey: process.env.GROQ_API_KEY, // Server-side only
// })

export default null // Intentionally disabled on client
