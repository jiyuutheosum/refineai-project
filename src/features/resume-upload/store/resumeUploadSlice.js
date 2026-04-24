import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const uploadResume = createAsyncThunk(
  'resumeUpload/uploadResume',
  async (file, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 5000))
      return { fileName: file.name, fileSize: file.size }
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
    workflowState: {
      completedPhases: []
    }
  },
  reducers: {
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload
    },
    setValidationState: (state, action) => {
      state.validationState = action.payload
    },
    resetUpload: (state) => {
      state.selectedFile = null
      state.validationState = { type: '', message: '' }
      state.isProcessing = false
      state.processingProgress = 0
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.isProcessing = true
        state.status = 'loading'
        state.processingProgress = 0
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.isProcessing = false
        state.status = 'succeeded'
        state.processingProgress = 100
      })
      .addCase(uploadResume.rejected, (state) => {
        state.isProcessing = false
        state.status = 'failed'
        state.processingProgress = 0
      })
  },
})

export const { setSelectedFile, setValidationState, resetUpload } = resumeUploadSlice.actions
export default resumeUploadSlice.reducer
