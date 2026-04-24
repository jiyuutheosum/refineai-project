export const selectFeedbackSummary = (state) => state.feedback

export const selectOverallScore = (state) => state.feedback.overallScore
export const selectTotalIssues = (state) => state.feedback.totalIssues
export const selectStrengths = (state) => state.feedback.strengths
export const selectImprovements = (state) => state.feedback.improvements
export const selectCategoryScores = (state) => state.feedback.categoryScores
export const selectSectionBreakdowns = (state) => state.feedback.sectionBreakdowns
export const selectPriorityActions = (state) => state.feedback.priorityActions
export const selectEducationalResources = (state) => state.feedback.educationalResources
export const selectStatus = (state) => state.feedback.status
export const selectError = (state) => state.feedback.error

