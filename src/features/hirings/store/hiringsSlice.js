import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchJobsByRole } from '../services/adzuna.api'

export const fetchJobs = createAsyncThunk(
  'hirings/fetchJobs',
  async ({ role, page = 1 }, { rejectWithValue }) => {
    try {
      return await fetchJobsByRole(role, page)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const hiringsSlice = createSlice({
  name: 'hirings',
  initialState: {
    jobs: [],
    totalResults: 0,
    currentPage: 1,
    detectedRole: '',
    status: 'idle',
    error: null,
  },
  reducers: {
    setDetectedRole: (state, action) => {
      state.detectedRole = action.payload
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    resetHirings: (state) => {
      state.jobs = []
      state.totalResults = 0
      state.currentPage = 1
      state.detectedRole = ''
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.jobs = action.payload.jobs
        state.totalResults = action.payload.totalResults
        state.currentPage = action.payload.page
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { setDetectedRole, setPage, resetHirings } = hiringsSlice.actions
export default hiringsSlice.reducer