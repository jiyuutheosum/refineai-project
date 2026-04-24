import { z } from 'zod'

export const ResumeSectionSchema = z.object({
  id: z.number(),
  section: z.string(),
  content: z.string()
})

export const FeedbackItemSchema = z.object({
  id: z.number(),
  section: z.string(),
  category: z.string(),
  title: z.string(),
  reason: z.string(),
  suggestion: z.string()
})

