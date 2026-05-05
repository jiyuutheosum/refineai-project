import { useCallback, useEffect, useRef } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'

import {
  selectAutoSaveStatus,
  selectFeedbackItems,
  selectResumeSections,
} from '../store/selectors'

import {
  updateSectionContent,
  setAutoSaveStatus,
} from '../store/manualEditorSlice'

const AUTO_SAVE_DELAY = 1000

export function useManualEditor() {
  const dispatch = useAppDispatch()
  const autoSaveTimerRef = useRef(null)

  const resumeSections = useAppSelector(selectResumeSections)
  const feedbackItems = useAppSelector(selectFeedbackItems)
  const autoSaveStatus = useAppSelector(selectAutoSaveStatus)

  const handleContentChange = useCallback(
    (sectionId, newContent) => {
      dispatch(updateSectionContent({ sectionId, newContent }))
      dispatch(setAutoSaveStatus('saving'))

      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }

      autoSaveTimerRef.current = setTimeout(() => {
        dispatch(setAutoSaveStatus('saved'))
      }, AUTO_SAVE_DELAY)
    },
    [dispatch]
  )

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [])

  return {
    resumeSections,
    feedbackItems,
    autoSaveStatus,
    handleContentChange,
  }
}