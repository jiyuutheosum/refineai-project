import { z } from 'zod'

export const FeedbackSummarySchema = z.object({
  overallScore: z.number().min(0).max(100),
  totalIssues: z.number().min(0),
  strengths: z.number().min(0),
  improvements: z.number().min(0),
  categoryScores: z.array(z.object({
    category: z.string(),
    score: z.number().min(0).max(100),
    description: z.string(),
    color: z.string(),
    icon: z.string()
  })),
  sectionBreakdowns: z.array(z.any()),
  priorityActions: z.array(z.any()),
  educationalResources: z.array(z.any())
})

export const PriorityActionSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  impact: z.number().min(0).max(100),
  category: z.string()
})

