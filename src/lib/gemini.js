// import { GoogleGenerativeAI } from '@google/generative-ai'

// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

// export const geminiModel = genAI.getGenerativeModel(
//   { model: 'gemini-2.0-flash-lite' },
//   { apiVersion: 'v1beta' }
// )

// export default genAI


// FOR FUTURE REFERENCE: The above code is how we would set up the Gemini client if we were to use it directly. However, since we're currently using Groq as a proxy to access Gemini, the actual implementation is in src/lib/groq.js, and the above code is not needed at this time.