import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'

import {
  uploadResume,
  setSelectedFile,
  setValidationState,
  setProcessingProgress,
  setCurrentResume,
  resetUpload,
} from '../store/resumeUploadSlice'

import { validateFile } from '../utils/fileValidators'
import { uploadResumeAPI } from '../services/resumeUpload.api'

function useResumeUpload() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const resumeUploadState = useAppSelector((state) => state.resumeUpload)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingFile, setPendingFile] = useState(null)

  const handleFileSelect = useCallback(
    (file) => {
      if (!file) return

      const validation = validateFile(file)

      dispatch(
        setValidationState({
          type: validation.type,
          message: validation.message,
        })
      )

      if (!validation.valid) return

      // Store the file and show confirmation modal
      setPendingFile(file)
      setShowConfirmModal(true)

      dispatch(
        setSelectedFile({
          file,
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date().toISOString(),
          processingStatus: 'uploading',
        })
      )
    },
    [dispatch]
)

  const handleConfirmAnalysis = useCallback(async () => {
    if (!pendingFile) return
    setShowConfirmModal(false)

    try {
      // Dispatch the Redux thunk — this uploads the file AND saves to Firestore
      // The extraReducers in the slice will automatically set currentResume on success
      const result = await dispatch(
        uploadResume({
          file: pendingFile,
          onProgress: (progress) => dispatch(setProcessingProgress(progress)),
        })
      ).unwrap()

      // Ensure the result has resumeId alias for compatibility with analysis page
      const resumeData = {
        ...result,
        resumeId: result.resumeId || result.id,
      }

      // Save the resume result to Redux so analysis page can access it
      dispatch(setCurrentResume(resumeData))

      // Navigate to analysis page only after upload succeeds
      navigate('/resume-analysis')
    } catch (error) {
      dispatch(
        setValidationState({
          type: 'error',
          message: error?.message || 'Failed to upload resume. Please try again.',
        })
      )
    }
  }, [dispatch, navigate, pendingFile])

  const handleCancelAnalysis = useCallback(() => {
    setShowConfirmModal(false)
    setPendingFile(null)
    dispatch(resetUpload())
  }, [dispatch])

  const handleReupload = useCallback(() => {
    dispatch(resetUpload())
    navigate('/')
  }, [dispatch, navigate])

  return {
    ...resumeUploadState,
    showConfirmModal,
    pendingFile,
    handleFileSelect,
    handleConfirmAnalysis,
    handleCancelAnalysis,
    handleReupload,
  }
}

export default useResumeUpload
