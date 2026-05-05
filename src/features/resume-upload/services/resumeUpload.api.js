import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore'
import { storage, db, auth } from '@/lib/firebase'

// Security: Allowed MIME types for resume uploads
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

// Security: File size limits (max 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024
const MIN_FILE_SIZE = 1024 // Minimum 1KB

/**
 * Sanitize filename to prevent XSS and path traversal attacks
 */
function sanitizeFileName(fileName) {
  return fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/\.\./g, '_')
    .substring(0, 255)
}

/**
 * Validate file type against allowlist
 */
function validateFileType(fileType) {
  return ALLOWED_FILE_TYPES.includes(fileType)
}

/**
 * Validate file size within allowed limits
 */
function validateFileSize(fileSize) {
  return fileSize > MIN_FILE_SIZE && fileSize <= MAX_FILE_SIZE
}

/**
 * Validate file before upload
 */
function validateFile(file) {
  if (!file) {
    throw new Error('No resume file provided.')
  }

  if (!validateFileType(file.type)) {
    throw new Error('Invalid file type. Accepted formats: PDF, DOC, DOCX')
  }

  if (!validateFileSize(file.size)) {
    throw new Error(`File size must be between 1KB and 5MB`)
  }

  return true
}

/**
 * Upload resume file to Firebase Storage and save metadata to Firestore
 * @param {File} file - The file to upload
 * @param {function} onProgress - Callback for upload progress (0-100)
 * @returns {Promise<{id, fileName, fileSize, uploadDate, downloadURL, status}>}
 */
export async function uploadResumeAPI(file, onProgress) {
  // Security: Validate file before processing
  validateFile(file)

  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to upload a resume.')
  }

  const safeFileName = sanitizeFileName(file.name)
  const timestamp = Date.now()
  const storagePath = `resumes/${user.uid}/${timestamp}_${safeFileName}`

  // Create storage reference
  const storageRef = ref(storage, storagePath)

  // Create upload task with progress tracking
  const uploadTask = uploadBytesResumable(storageRef, file)

  // Return a promise that resolves when upload is complete
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        if (onProgress) {
          onProgress(progress)
        }
      },
      (error) => {
        reject(new Error(getStorageErrorMessage(error)))
      },
      async () => {
        try {
          // Get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

          // Save metadata to Firestore
          const resumeId = `${timestamp}_${Math.random().toString(36).substring(2, 11)}`
          const resumeDocRef = doc(
            db,
            'users',
            user.uid,
            'resumes',
            resumeId
          )

          await setDoc(resumeDocRef, {
            uid: user.uid,
            resumeId,
            fileName: safeFileName,
            originalFileName: file.name,
            fileSize: file.size,
            fileType: file.type.includes('pdf') ? 'pdf' : 'docx',
            storagePath,
            downloadURL,
            analysisStatus: 'pending',
            uploadDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })

          resolve({
            id: resumeId,
            fileName: safeFileName,
            fileSize: file.size,
            uploadDate: new Date().toISOString(),
            downloadURL,
            status: 'uploaded',
          })
        } catch (error) {
          reject(new Error(getStorageErrorMessage(error)))
        }
      }
    )
  })
}

/**
 * Get upload status
 * @param {string} resumeId - The resume ID
 * @returns {Promise<{status, progress}>}
 */
export async function getUploadStatus(resumeId) {
  const user = auth.currentUser
  if (!user) {
    throw new Error('You must be logged in to check upload status.')
  }

  if (!resumeId) {
    throw new Error('Valid resume ID is required.')
  }

  const resumeDocRef = doc(db, 'resumes', resumeId)
  const resumeDoc = await getDoc(resumeDocRef)

  if (!resumeDoc.exists()) {
    throw new Error('Resume not found.')
  }

  const data = resumeDoc.data()
  return {
    status: data.status || 'unknown',
    progress: 100,
  }
}

/**
 * Get all resumes for the current user
 * @returns {Promise<Array>} Array of resume metadata
 */
export async function getUserResumes() {
  const user = auth.currentUser
  if (!user) throw new Error('You must be logged in to view resumes.')

  const resumesRef = collection(db, 'resumes')
  const q = query(
    resumesRef,
    where('uid', '==', user.uid),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

/**
 * Get friendly storage error message
 */
function getStorageErrorMessage(error) {
  switch (error.code) {
    case 'storage/unauthorized':
      return 'You are not authorized to upload files.'
    case 'storage/canceled':
      return 'Upload was canceled.'
    case 'storage/unknown':
      return 'An unknown error occurred during upload.'
    case 'storage/invalid-format':
      return 'Invalid file format.'
    case 'storage/server-error':
      return 'Server error. Please try again later.'
    default:
      return error.message || 'An unexpected error occurred.'
  }
}
