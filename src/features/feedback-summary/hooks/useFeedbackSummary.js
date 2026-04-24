import { useSelector } from 'react-redux'
import {
  selectOverallScore,
  selectTotalIssues,
  selectStrengths,
  selectImprovements,
  selectCategoryScores,
  selectSectionBreakdowns,
  selectPriorityActions,
  selectEducationalResources,
  selectStatus
} from '../store/selectors'

export const useFeedbackSummary = () => {
  const overallScore = useSelector(selectOverallScore)
  const totalIssues = useSelector(selectTotalIssues)
  const strengths = useSelector(selectStrengths)
  const improvements = useSelector(selectImprovements)
  const categoryScores = useSelector(selectCategoryScores)
  const sectionBreakdowns = useSelector(selectSectionBreakdowns)
  const priorityActions = useSelector(selectPriorityActions)
  const educationalResources = useSelector(selectEducationalResources)
  const status = useSelector(selectStatus)

  const summaryData = {
    overallScore,
    totalIssues,
    strengths,
    improvements,
    categoryScores,
    sectionBreakdowns,
    priorityActions,
    educationalResources
  }

  return {
    summaryData,
    status
  }
}

