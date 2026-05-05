export const ACCEPTED_RESUME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const ACCEPTED_RESUME_EXTENSIONS = ['.pdf', '.docx']

export const MIN_FILE_SIZE = 2 * 1024 * 1024 // 2MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const uploadSchema = {
  fileTypes: ACCEPTED_RESUME_TYPES,
  fileExtensions: ACCEPTED_RESUME_EXTENSIONS,
  minSize: MIN_FILE_SIZE,
  maxSize: MAX_FILE_SIZE,
}

export default uploadSchema