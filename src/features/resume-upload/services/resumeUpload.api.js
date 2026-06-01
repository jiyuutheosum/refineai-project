import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import {
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDocsFromServer,
} from 'firebase/firestore'
import { storage, db, auth } from '@/lib/firebase'

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MIN_FILE_SIZE = 1024

function sanitizeFileName(fileName) {
  return fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/\.\./g, '_')
    .substring(0, 255)
}

function validateFileType(fileType) {
  return ALLOWED_FILE_TYPES.includes(fileType)
}

function validateFileSize(fileSize) {
  return fileSize > MIN_FILE_SIZE && fileSize <= MAX_FILE_SIZE
}

function validateFile(file) {
  if (!file) throw new Error('No resume file provided.')
  if (!validateFileType(file.type)) throw new Error('Invalid file type. Accepted formats: PDF, DOC, DOCX')
  if (!validateFileSize(file.size)) throw new Error('File size must be between 1KB and 5MB')
  return true
}

export async function uploadResumeAPI(file, onProgress) {
  validateFile(file)

  const user = auth.currentUser
  if (!user) throw new Error('You must be logged in to upload a resume.')

  const safeFileName = sanitizeFileName(file.name)
  const timestamp = Date.now()
  const resumeId = `${timestamp}_${Math.random().toString(36).substring(2, 11)}`
  const storagePath = `resumes/${user.uid}/${timestamp}_${safeFileName}`
  const storageRef = ref(storage, storagePath)
  const uploadTask = uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        if (onProgress) onProgress(progress)
      },
      (error) => {
        reject(new Error(getStorageErrorMessage(error)))
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

          const resumeDocRef = doc(db, 'resumes', resumeId)

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
            resumeId,
            id: resumeId,
            uid: user.uid,
            fileName: safeFileName,
            fileSize: file.size,
            fileType: file.type.includes('pdf') ? 'pdf' : 'docx',
            downloadURL,
            storagePath,
            uploadDate: new Date().toISOString(),
            analysisStatus: 'pending',
          })
        } catch (error) {
          reject(new Error(getStorageErrorMessage(error)))
        }
      }
    )
  })
}

export async function getUploadStatus(resumeId) {
  const user = auth.currentUser
  if (!user) throw new Error('You must be logged in to check upload status.')
  if (!resumeId) throw new Error('Valid resume ID is required.')

  const resumeDocRef = doc(db, 'resumes', resumeId)
  const resumeDoc = await getDocFromServer(resumeDocRef)

  if (!resumeDoc.exists()) throw new Error('Resume not found.')

  const data = resumeDoc.data()
  return {
    status: data.analysisStatus || 'unknown',
    progress: 100,
  }
}

export async function getUserResumes() {
  const user = auth.currentUser
  if (!user) throw new Error('You must be logged in to view resumes.')

  const resumesRef = collection(db, 'resumes')
  const q = query(
    resumesRef,
    where('uid', '==', user.uid),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocsFromServer(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

function getStorageErrorMessage(error) {
  switch (error.code) {
    case 'storage/unauthorized': return 'You are not authorized to upload files.'
    case 'storage/canceled': return 'Upload was canceled.'
    case 'storage/unknown': return 'An unknown error occurred during upload.'
    case 'storage/invalid-format': return 'Invalid file format.'
    case 'storage/server-error': return 'Server error. Please try again later.'
    default: return error.message || 'An unexpected error occurred.'
  }
}