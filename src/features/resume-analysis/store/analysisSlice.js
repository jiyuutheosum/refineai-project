import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { runResumeAnalysis, fetchAnalysisFromFirestore } from '../services/analysis.api'

export const analyzeResume = createAsyncThunk(
  'analysis/analyzeResume',
  async ({ resumeId, file, uid }, { rejectWithValue }) => {
    try {
      const existing = await fetchAnalysisFromFirestore(resumeId)
      if (existing) return existing
      return await runResumeAnalysis({ resumeId, file, uid })
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    overallScore: 0,
    overallFeedback: '',
    sectionFeedback: [],
    extractedSections: null, // real resume content per section
    status: 'idle',
    error: null,
  },
  reducers: {
    resetAnalysis: (state) => {
      state.overallScore = 0
      state.overallFeedback = ''
      state.sectionFeedback = []
      state.extractedSections = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeResume.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.overallScore = action.payload.overallScore
        state.overallFeedback = action.payload.overallFeedback
        state.sectionFeedback = action.payload.sectionFeedback
        state.extractedSections = action.payload.extractedSections ?? null
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { resetAnalysis } = analysisSlice.actions
export default analysisSlice.reducer