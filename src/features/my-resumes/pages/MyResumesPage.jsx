import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { loadUserResumes, deleteResume } from '../store/myResumesSlice'
import Icon from '@/shared/components/AppIcon'
import Button from '@/shared/components/ui/Button'
import UsageQuota from '@/shared/components/UsageQuota'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'

function MyResumesPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    resumes,
    listStatus,
    deleteStatus,
    deletingResumeId,
    error,
  } = useAppSelector((state) => state.myResumes)

  const [resumeToDelete, setResumeToDelete] = useState(null)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    // Always fetch the latest data from Firestore when the page loads.
    // This ensures that scores updated via re-analysis are reflected.
    dispatch(loadUserResumes())
  }, [dispatch])

  useEffect(() => {
    if (!notice) return

    const timer = setTimeout(() => {
      setNotice(null)
    }, 3500)

    return () => clearTimeout(timer)
  }, [notice])

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown size'
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  const getScoreColor = (score) => {
    if (!score) return 'text-muted-foreground'
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-warning'
    return 'text-destructive'
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
            Analyzed
          </span>
        )
      case 'pending':
        return (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Pending
          </span>
        )
      case 'needs_reanalysis':
        return (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Needs Analysis
          </span>
        )
      case 'failed':
        return (
          <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
            Failed
          </span>
        )
      default:
        return (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {status || 'Unknown'}
          </span>
        )
    }
  }

  const openDeleteModal = (event, resume) => {
    event.stopPropagation()
    setResumeToDelete(resume)
  }

  const closeDeleteModal = () => {
    if (deleteStatus === 'loading') return
    setResumeToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!resumeToDelete) return

    const resumeId = resumeToDelete.resumeId || resumeToDelete.id

    try {
      await dispatch(deleteResume(resumeId)).unwrap()

      setNotice({
        type: 'success',
        message: 'Resume deleted successfully.',
      })

      setResumeToDelete(null)
    } catch (err) {
      setNotice({
        type: 'error',
        message:
          err?.message ||
          'Unable to delete resume. Please check your permissions and try again.',
      })
    }
  }

  const deletingFileName =
    resumeToDelete?.fileName ||
    resumeToDelete?.originalFileName ||
    'this resume'

  return (
    <div className="min-h-screen bg-background">
      {notice && (
        <div className="fixed right-6 top-6 z-50">
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              notice.type === 'success'
                ? 'border-success/30 bg-success/10 text-success'
                : 'border-destructive/30 bg-destructive/10 text-destructive'
            }`}
          >
            <Icon
              name={notice.type === 'success' ? 'CheckCircle2' : 'AlertCircle'}
              size={18}
            />
            <p className="text-sm font-medium">{notice.message}</p>
          </div>
        </div>
      )}

      {resumeToDelete && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={closeDeleteModal}
        >
          <div
            className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Icon name="Trash2" size={22} className="text-destructive" />
            </div>

            <h2 className="text-xl font-semibold text-foreground">
              Delete resume?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This will permanently remove{' '}
              <span className="font-medium text-foreground">
                "{deletingFileName}"
              </span>{' '}
              and its feedback analysis. This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closeDeleteModal}
                disabled={deleteStatus === 'loading'}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteStatus === 'loading'}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteStatus === 'loading' ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Icon name="Trash2" size={16} />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <header className="mb-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                  My Resumes
                </h1>
                <p className="mt-2 text-base text-muted-foreground">
                  All your resumes — uploaded files and ones created manually from templates.
                </p>
                <div className="mt-3">
                  <UsageQuota compact />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate('/manual-resume-editor', {
                      state: { scratch: true },
                    })
                  }
                >
                  <Icon name="Edit3" size={16} />
                  Create Manually
                </Button>

                <Button onClick={() => navigate('/')}>
                  <Icon name="Plus" size={16} />
                  Upload New
                </Button>
              </div>
            </div>
          </header>

          {listStatus === 'loading' && (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
                <p className="text-sm text-muted-foreground">
                  Loading your resumes...
                </p>
              </div>
            </div>
          )}

          {listStatus === 'failed' && (
            <div className="flex min-h-[40vh] items-center justify-center text-center">
              <div>
                <p className="mb-4 text-destructive">{error}</p>
                <Button onClick={() => dispatch(loadUserResumes())}>
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {listStatus === 'succeeded' && resumes.length === 0 && (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Icon
                  name="FileText"
                  size={28}
                  className="text-muted-foreground"
                />
              </div>

              <h2 className="mb-2 text-xl font-semibold text-foreground">
                No resumes yet
              </h2>

              <p className="mb-6 text-sm text-muted-foreground">
                Upload your first resume to get started.
              </p>

              <Button onClick={() => navigate('/')}>
                <Icon name="Upload" size={16} />
                Upload Resume
              </Button>
            </div>
          )}

          {listStatus === 'succeeded' && resumes.length > 0 && (
            <div className="space-y-4">
              {resumes.map((resume) => {
                const resumeId = resume.resumeId || resume.id
                const isDeleting =
                  deleteStatus === 'loading' && deletingResumeId === resumeId

                return (
                  <div
                    key={resumeId}
                    onClick={() => navigate(`/my-resumes/${resumeId}`)}
                    className="flex cursor-pointer items-center gap-5 rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon
                        name={
                          resume.fileType === 'manual'
                            ? 'Edit3'
                            : resume.fileType === 'pdf'
                              ? 'FileText'
                              : 'FileType'
                        }
                        size={24}
                        className="text-primary"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold text-foreground">
                        {resume.fileName || resume.originalFileName}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={11} />
                          {formatDate(resume.uploadDate || resume.createdAt)}
                        </span>

                        <span className="flex items-center gap-1">
                          <Icon name="HardDrive" size={11} />
                          {resume.fileType === 'manual' ? '—' : formatSize(resume.fileSize)}
                        </span>

                        <span className="font-medium uppercase flex items-center gap-1">
                          {resume.fileType === 'manual' ? (
                            <>
                              <Icon name="Edit3" size={11} />
                              MANUAL
                            </>
                          ) : (
                            resume.fileType
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      {resume.overallScore ? (
                        <>
                          <span
                            className={`text-2xl font-bold ${getScoreColor(
                              resume.overallScore
                            )}`}
                          >
                            {resume.overallScore}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Score
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {getStatusBadge(resume.analysisStatus)}
                    </div>

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={(event) => openDeleteModal(event, resume)}
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Delete resume"
                      title="Delete resume"
                    >
                      <Icon
                        name={isDeleting ? 'Loader2' : 'Trash2'}
                        size={17}
                        className={isDeleting ? 'animate-spin' : ''}
                      />
                    </button>

                    <Icon
                      name="ChevronRight"
                      size={18}
                      className="flex-shrink-0 text-muted-foreground"
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MyResumesPage