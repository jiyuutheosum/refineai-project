import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { uploadResume, setSelectedFile, setValidationState, resetUpload } from '../store/resumeUploadSlice'
import { validateFile } from '../utils/fileValidators'

const useResumeUpload = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const state = useSelector((state) => state.resumeUpload)

  const handleFileSelect = (file) => {
    const validation = validateFile(file)
    dispatch(setValidationState({ type: validation.type, message: validation.message }))

    if (validation.valid) {
      dispatch(setSelectedFile({
        file,
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date(),
        processingStatus: 'uploading'
      }))
      dispatch(uploadResume(file))
    }
  }

  const handleReupload = () => {
    dispatch(resetUpload())
  }

  return {
    ...state,
    handleFileSelect,
    handleReupload,
    navigate
  }
}

export default useResumeUpload

