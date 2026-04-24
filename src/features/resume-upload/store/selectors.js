import { createSelector } from '@reduxjs/toolkit'

export const selectResumeUpload = (state) => state.resumeUpload

export const selectValidationState = createSelector(
  [selectResumeUpload],
  (upload) => upload.validationState
)

export const selectProcessingProgress = createSelector(
  [selectResumeUpload],
  (upload) => upload.processingProgress
)

export const selectIsProcessing = (state) => state.resumeUpload.isProcessing
