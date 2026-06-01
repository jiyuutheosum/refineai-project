import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUserResumes } from '../../resume-upload/services/resumeUpload.api'
import {
  fetchResumeWithFeedback,
  deleteResumeWithFeedback,
} from '../services/myResumes.api'

export const loadUserResumes = createAsyncThunk(
  'myResumes/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserResumes()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const loadResumeDetail = createAsyncThunk(
  'myResumes/loadDetail',
  async (resumeId, { rejectWithValue }) => {
    try {
      return await fetchResumeWithFeedback(resumeId)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteResume = createAsyncThunk(
  'myResumes/deleteResume',
  async (resumeId, { rejectWithValue }) => {
    try {
      return await deleteResumeWithFeedback(resumeId)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const myResumesSlice = createSlice({
  name: 'myResumes',
  initialState: {
    resumes: [],
    selectedResume: null,
    selectedFeedback: null,
    listStatus: 'idle',
    detailStatus: 'idle',
    deleteStatus: 'idle',
    deletingResumeId: null,
    error: null,
  },
  reducers: {
    clearSelectedResume: (state) => {
      state.selectedResume = null
      state.selectedFeedback = null
      state.detailStatus = 'idle'
    },

    // Optimistically update the score in the list immediately after re-analysis,
    // before the loadUserResumes fetch completes
    updateResumeScore: (state, action) => {
      const { resumeId, overallScore } = action.payload
      const resume = state.resumes.find(
        (r) => (r.resumeId || r.id) === resumeId
      )
      if (resume) {
        resume.overallScore = overallScore
        resume.analysisStatus = 'completed'
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserResumes.pending, (state) => {
        state.listStatus = 'loading'
        state.error = null
      })
      .addCase(loadUserResumes.fulfilled, (state, action) => {
        state.listStatus = 'succeeded'
        state.resumes = action.payload
      })
      .addCase(loadUserResumes.rejected, (state, action) => {
        state.listStatus = 'failed'
        state.error = action.payload
      })
      .addCase(loadResumeDetail.pending, (state) => {
        state.detailStatus = 'loading'
        state.error = null
      })
      .addCase(loadResumeDetail.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded'
        state.selectedResume = action.payload.resume
        state.selectedFeedback = action.payload.feedback
      })
      .addCase(loadResumeDetail.rejected, (state, action) => {
        state.detailStatus = 'failed'
        state.error = action.payload
      })
      .addCase(deleteResume.pending, (state, action) => {
        state.deleteStatus = 'loading'
        state.deletingResumeId = action.meta.arg
        state.error = null
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded'
        state.deletingResumeId = null
        state.resumes = state.resumes.filter((resume) => {
          const id = resume.resumeId || resume.id
          return id !== action.payload
        })
        if (
          state.selectedResume &&
          (state.selectedResume.resumeId === action.payload ||
            state.selectedResume.id === action.payload)
        ) {
          state.selectedResume = null
          state.selectedFeedback = null
          state.detailStatus = 'idle'
        }
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.deleteStatus = 'failed'
        state.deletingResumeId = null
        state.error = action.payload
      })
  },
})

export const { clearSelectedResume, updateResumeScore } = myResumesSlice.actions
export default myResumesSlice.reducer