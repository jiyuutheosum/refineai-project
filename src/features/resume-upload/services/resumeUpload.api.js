import axios from 'axios'

// Mock API
export const uploadResumeAPI = async (file) => {
  const formData = new FormData()
  formData.append('resume', file)

  // Simulate
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return { success: true, data: { id: 'mock-id', fileName: file.name } }
}

export const getUploadStatus = async (id) => {
  // Simulate
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { status: 'completed', progress: 100 }
}
