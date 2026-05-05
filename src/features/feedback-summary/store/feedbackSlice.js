import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchFeedbackSummary, saveFeedbackSummary } from '../services/feedback.api'

// Async thunk for fetching feedback
export const fetchFeedback = createAsyncThunk(
  'feedback/fetchFeedback',
  async (resumeId, { rejectWithValue }) => {
    try {
      const feedback = await fetchFeedbackSummary(resumeId)
      return feedback
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for saving feedback
export const saveFeedback = createAsyncThunk(
  'feedback/saveFeedback',
  async ({ resumeId, feedbackData }, { rejectWithValue }) => {
    try {
      await saveFeedbackSummary(resumeId, feedbackData)
      return feedbackData
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  overallScore: 0,
  totalIssues: 0,
  strengths: 0,
  improvements: 0,
  categoryScores: [],
  sectionBreakdowns: [],
  priorityActions: [],
  educationalResources: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentResumeId: null,
}

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setSummaryData(state, action) {
      const summaryData = action.payload ?? {}

      state.overallScore = summaryData.overallScore ?? state.overallScore
      state.totalIssues = summaryData.totalIssues ?? state.totalIssues
      state.strengths = summaryData.strengths ?? state.strengths
      state.improvements = summaryData.improvements ?? state.improvements
      state.categoryScores = summaryData.categoryScores ?? state.categoryScores
      state.sectionBreakdowns =
        summaryData.sectionBreakdowns ?? state.sectionBreakdowns
      state.priorityActions = summaryData.priorityActions ?? state.priorityActions
      state.educationalResources =
        summaryData.educationalResources ?? state.educationalResources
    },

    setStatus(state, action) {
      state.status = action.payload
    },

    setError(state, action) {
      state.error = action.payload
      state.status = action.payload ? 'failed' : state.status
    },

    setCurrentResumeId(state, action) {
      state.currentResumeId = action.payload
    },

    clearFeedback() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feedback
      .addCase(fetchFeedback.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const data = action.payload
        state.overallScore = data.overallScore ?? 0
        state.totalIssues = data.totalIssues ?? 0
        state.strengths = data.strengths ?? 0
        state.improvements = data.improvements ?? 0
        state.categoryScores = data.categoryScores ?? []
        state.sectionBreakdowns = data.sectionBreakdowns ?? []
        state.priorityActions = data.priorityActions ?? []
        state.educationalResources = data.educationalResources ?? []
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Save feedback
      .addCase(saveFeedback.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(saveFeedback.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(saveFeedback.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const {
  setSummaryData,
  setStatus,
  setError,
  setCurrentResumeId,
  clearFeedback,
} = feedbackSlice.actions

export default feedbackSlice.reducer
