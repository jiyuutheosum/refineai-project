import { useAppSelector } from '@/app/store/hooks'

import {
  selectOverallScore,
  selectTotalIssues,
  selectStrengths,
  selectImprovements,
  selectCategoryScores,
  selectSectionBreakdowns,
  selectPriorityActions,
  selectEducationalResources,
  selectFeedbackStatus,
} from '../store/selectors'

export function useFeedbackSummary() {
  const overallScore = useAppSelector(selectOverallScore)
  const totalIssues = useAppSelector(selectTotalIssues)
  const strengths = useAppSelector(selectStrengths)
  const improvements = useAppSelector(selectImprovements)
  const categoryScores = useAppSelector(selectCategoryScores)
  const sectionBreakdowns = useAppSelector(selectSectionBreakdowns)
  const priorityActions = useAppSelector(selectPriorityActions)
  const educationalResources = useAppSelector(selectEducationalResources)
  const status = useAppSelector(selectFeedbackStatus)

  return {
    summaryData: {
      overallScore,
      totalIssues,
      strengths,
      improvements,
      categoryScores,
      sectionBreakdowns,
      priorityActions,
      educationalResources,
    },
    status,
  }
}