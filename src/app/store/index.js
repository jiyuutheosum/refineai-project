import { configureStore } from '@reduxjs/toolkit'
import resumeUploadReducer from '../../features/resume-upload/store/resumeUploadSlice'
import feedbackReducer from '../../features/feedback-summary/store/feedbackSlice'
import manualEditorReducer from '../../features/manual-resume-editor/store/manualEditorSlice'
import authReducer from '../../features/auth/store/authSlice'
import analysisReducer from '../../features/resume-analysis/store/analysisSlice'
import hiringsReducer from '../../features/hirings/store/hiringsSlice'
import myResumesReducer from '../../features/my-resumes/store/myResumesSlice'

export const store = configureStore({
  reducer: {
    resumeUpload: resumeUploadReducer,
    feedback: feedbackReducer,
    manualEditor: manualEditorReducer,
    auth: authReducer,
    analysis: analysisReducer,
    hirings: hiringsReducer,
    myResumes: myResumesReducer,
  },
  devTools: import.meta.env.DEV,
})

export const getRootState = store.getState
export const appDispatch = store.dispatch