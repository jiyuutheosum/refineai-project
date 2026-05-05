import { createSelector } from '@reduxjs/toolkit'

export const selectFeedbackSummary = (state) => state.feedback

export const selectOverallScore = createSelector(
  selectFeedbackSummary,
  (feedback) => feedback.overallScore
)

export const selectTotalIssues = createSelector(
  selectFeedbackSummary,
  (feedback) => feedback.totalIssues
)

export const selectStrengths = createSelector(
  selectFeedbackSummary,
  (feedback) => feedback.strengths
)

export const selectImprovements = createSelector(
  selectFeedbackSummary,
  (feedback) => feedback.improvements
)

export const selectCategoryScores = createSelector(
  selectFeedbackSummary,
  (feedback) => feedback.categoryScores
)

export const selectSectionBreakdowns = createSelector(
  selectFeedbackSummary,
  (feedback) => feedback.sectionBreakdowns
)

export const selectPriorityActions = createSelector(
  selectFeedbackSummary,
  (feedback) => feedback.priorityActions
)

export const selectEducationalResources = createSelector(
  selectFeedbackSummary,
  (feedback) => feedback.educationalResources
)

export const selectFeedbackStatus = createSelector(
  selectFeedbackSummary,
  (feedback) => feedback.status
)

export const selectFeedbackError = createSelector(
  selectFeedbackSummary,
  (feedback) => feedback.error
)