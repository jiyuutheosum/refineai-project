import { configureStore } from '@reduxjs/toolkit'
import resumeUploadReducer from '../../features/resume-upload/store/resumeUploadSlice'
import feedbackReducer from '../../features/feedback-summary/store/feedbackSlice'
import manualEditorReducer from '../../features/manual-resume-editor/store/manualEditorSlice'
// Add other reducers

export const store = configureStore({
  reducer: {
    resumeUpload: resumeUploadReducer,
    feedback: feedbackReducer,
    manualEditor: manualEditorReducer,
    // Add others
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

