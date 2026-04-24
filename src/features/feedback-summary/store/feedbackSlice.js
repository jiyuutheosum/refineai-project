import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  overallScore: 72,
  totalIssues: 18,
  strengths: 12,
  improvements: 6,
  categoryScores: [
    {
      category: 'Impact',
      score: 68,
      description: 'Demonstrates results and achievements',
      color: 'bg-primary/10',
      icon: 'Target'
    },
    {
      category: 'Clarity',
      score: 78,
      description: 'Clear and concise communication',
      color: 'bg-secondary/10',
      icon: 'Eye'
    },
    {
      category: 'Specificity',
      score: 65,
      description: 'Concrete details and metrics',
      color: 'bg-warning/10',
      icon: 'Hash'
    },
    {
      category: 'Relevance',
      score: 75,
      description: 'Aligned with target roles',
      color: 'bg-success/10',
      icon: 'CheckCircle2'
    }
  ],
  sectionBreakdowns: [],
  priorityActions: [],
  educationalResources: [],
  status: 'idle',
  error: null
}

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setSummaryData: (state, action) => {
      state.overallScore = action.payload.overallScore
      state.totalIssues = action.payload.totalIssues
      state.strengths = action.payload.strengths
      state.improvements = action.payload.improvements
      state.categoryScores = action.payload.categoryScores
      state.sectionBreakdowns = action.payload.sectionBreakdowns
      state.priorityActions = action.payload.priorityActions
      state.educationalResources = action.payload.educationalResources
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearFeedback: (state) => {
      Object.assign(state, initialState)
    }
  }
})

export const { setSummaryData, setStatus, setError, clearFeedback } = feedbackSlice.actions
export default feedbackSlice.reducer

