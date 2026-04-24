// Simple validation schema for upload form
export const uploadSchema = {
  fileTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  minSize: 2 * 1024 * 1024,
  maxSize: 5 * 1024 * 1024,
}

// Extend with React Hook Form resolver if zod added
export default uploadSchema

