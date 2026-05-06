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

      setPendingFile(file)
      setShowConfirmModal(true)

      dispatch(
        setSelectedFile({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type.includes('pdf') ? 'pdf' : 'docx',
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
      const result = await dispatch(
        uploadResume({
          file: pendingFile,
          onProgress: (progress) => dispatch(setProcessingProgress(progress)),
        })
      ).unwrap()

      const resumeData = {
        ...result,
        resumeId: result.resumeId || result.id,
      }

      dispatch(setCurrentResume(resumeData))
      navigate('/resume-analysis', { state: { file: pendingFile } })
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