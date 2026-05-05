import { createSelector } from '@reduxjs/toolkit'

export const selectManualEditor = (state) => state.manualEditor

export const selectResumeSections = createSelector(
  selectManualEditor,
  (manualEditor) => manualEditor.resumeSections
)

export const selectOriginalSections = createSelector(
  selectManualEditor,
  (manualEditor) => manualEditor.originalSections
)

export const selectFeedbackItems = createSelector(
  selectManualEditor,
  (manualEditor) => manualEditor.feedbackItems
)

export const selectAutoSaveStatus = createSelector(
  selectManualEditor,
  (manualEditor) => manualEditor.autoSaveStatus
)

export const selectLastSaved = createSelector(
  selectManualEditor,
  (manualEditor) => manualEditor.lastSaved
)

export const selectIsSidebarOpen = createSelector(
  selectManualEditor,
  (manualEditor) => manualEditor.isSidebarOpen
)

export const selectShowComparison = createSelector(
  selectManualEditor,
  (manualEditor) => manualEditor.showComparison
)

export const selectManualEditorStatus = createSelector(
  selectManualEditor,
  (manualEditor) => manualEditor.status
)

export const selectManualEditorError = createSelector(
  selectManualEditor,
  (manualEditor) => manualEditor.error
)