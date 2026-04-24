import { useSelector, useDispatch } from 'react-redux'
import { selectResumeSections, selectFeedbackItems, selectAutoSaveStatus } from '../store/selectors'
import { updateSectionContent, setAutoSaveStatus } from '../store/manualEditorSlice'

export const useManualEditor = () => {
  const dispatch = useDispatch()
  const resumeSections = useSelector(selectResumeSections)
  const feedbackItems = useSelector(selectFeedbackItems)
  const autoSaveStatus = useSelector(selectAutoSaveStatus)

  const handleContentChange = (sectionId, newContent) => {
    dispatch(updateSectionContent({ sectionId, newContent }))
    dispatch(setAutoSaveStatus('saving'))
    setTimeout(() => dispatch(setAutoSaveStatus('saved')), 1000)
  }

  return {
    resumeSections,
    feedbackItems,
    autoSaveStatus,
    handleContentChange
  }
}

