import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { uploadResumeAPI, getUserResumes } from '../services/resumeUpload.api'

// LocalStorage key for persisting current resume data
const STORAGE_KEY = 'refineai_current_resume'

// Load persisted currentResume from localStorage
function loadPersistedResume() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

// Save currentResume to localStorage
function persistResume(resume) {
  try {
    if (resume) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

// Async thunk for uploading resume
export const uploadResume = createAsyncThunk(
  'resumeUpload/uploadResume',
  async ({ file, onProgress }, { rejectWithValue }) => {
    try {
      const result = await uploadResumeAPI(file, onProgress)
      return result
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk for fetching user resumes
export const fetchUserResumes = createAsyncThunk(
  'resumeUpload/fetchUserResumes',
  async (_, { rejectWithValue }) => {
    try {
      const resumes = await getUserResumes()
      return resumes
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const resumeUploadSlice = createSlice({
  name: 'resumeUpload',
  initialState: {
    selectedFile: null,
    validationState: { type: '', message: '' },
    isProcessing: false,
    processingProgress: 0,
    status: 'idle',
    error: null,
    workflowState: {
      completedPhases: [],
    },
    currentResume: loadPersistedResume(),
    userResumes: [],
  },
  reducers: {
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload
    },
    setValidationState: (state, action) => {
      state.validationState = action.payload
    },
    setProcessingProgress: (state, action) => {
      state.processingProgress = action.payload
    },
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload
      persistResume(action.payload)
    },
    resetUpload: (state) => {
      state.selectedFile = null
      state.validationState = { type: '', message: '' }
      state.isProcessing = false
      state.processingProgress = 0
      state.status = 'idle'
      state.error = null
      state.currentResume = null
      persistResume(null)
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload resume
      .addCase(uploadResume.pending, (state) => {
        state.isProcessing = true
        state.status = 'loading'
        state.processingProgress = 0
        state.error = null
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.isProcessing = false
        state.status = 'succeeded'
        state.processingProgress = 100
        state.currentResume = action.payload
        state.selectedFile = null
        persistResume(action.payload)
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.isProcessing = false
        state.status = 'failed'
        state.processingProgress = 0
        state.error = action.payload
      })
      // Fetch user resumes
      .addCase(fetchUserResumes.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUserResumes.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.userResumes = action.payload
      })
      .addCase(fetchUserResumes.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const {
  setSelectedFile,
  setValidationState,
  setProcessingProgress,
  setCurrentResume,
  resetUpload,
} = resumeUploadSlice.actions

export default resumeUploadSlice.reducer
