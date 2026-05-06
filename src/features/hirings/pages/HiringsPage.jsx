import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { fetchJobs, setPage } from '../store/hiringsSlice'
import { detectJobRole } from '../utils/detectJobRole'
import ProgressIndicator from '@/shared/components/feedback/ProgressIndicator'
import Icon from '@/shared/components/AppIcon'
import Button from '@/shared/components/ui/Button'

const workflowState = {
  completedPhases: ['/resume-upload', '/resume-analysis', '/manual-resume-editor', '/feedback-summary'],
  currentPhase: 'hirings',
}

function HiringsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { overallScore, sectionFeedback, overallFeedback } = useAppSelector((state) => state.analysis)
  const { jobs, totalResults, currentPage, status, error, detectedRole } = useAppSelector((state) => state.hirings)

  const role = detectJobRole(sectionFeedback, overallFeedback)
  const totalPages = Math.ceil(totalResults / 12)

  useEffect(() => {
    if (overallScore >= 80 && role) {
      dispatch(fetchJobs({ role, page: currentPage }))
    }
  }, [dispatch, role, overallScore, currentPage])

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage))
    dispatch(fetchJobs({ role, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Score gate — below 80
  if (overallScore < 80) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressIndicator workflowState={workflowState} />
        <main className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Icon name="Lock" size={36} className="text-muted-foreground" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-foreground">
            Job Listings Locked
          </h1>
          <p className="mb-2 max-w-md text-base text-muted-foreground">
            You need a resume score of <span className="font-semibold text-foreground">80 or above</span> to access job listings.
          </p>
          <p className="mb-8 max-w-md text-sm text-muted-foreground">
            Your current score is{' '}
            <span className={`font-bold text-lg ${overallScore >= 60 ? 'text-warning' : 'text-destructive'}`}>
              {overallScore}
            </span>
            . Improve your resume and re-analyze to unlock this feature.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => navigate('/manual-resume-editor')}>
              <Icon name="Edit3" size={16} />
              Improve Resume
            </Button>
            <Button variant="outline" onClick={() => navigate('/feedback-summary')}>
              View Feedback
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator workflowState={workflowState} />

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <header className="mb-10 text-center">
            <p className="mb-3 text-sm font-medium text-primary">Job Opportunities</p>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Hirings For You
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Based on your resume, we found jobs matching your profile as a{' '}
              <span className="font-semibold text-foreground capitalize">{role}</span>.
            </p>
          </header>

          {/* Score badge */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full border bg-success/10 px-4 py-2 text-sm font-medium text-success">
              <Icon name="CheckCircle" size={16} />
              Resume Score: {overallScore}/100 — Unlocked
            </div>
          </div>

          {/* Loading */}
          {status === 'loading' && (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Finding jobs for you...</p>
              </div>
            </div>
          )}

          {/* Error */}
          {status === 'failed' && (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => dispatch(fetchJobs({ role, page: currentPage }))}>
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Jobs grid */}
          {status === 'succeeded' && (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                Showing {jobs.length} of {totalResults.toLocaleString()} jobs
              </p>

              {jobs.length === 0 ? (
                <div className="flex min-h-[40vh] items-center justify-center text-center">
                  <div>
                    <Icon name="SearchX" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium text-foreground">No jobs found</p>
                    <p className="mt-2 text-sm text-muted-foreground">Try checking back later.</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <Icon name="ChevronLeft" size={16} />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function JobCard({ job }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently posted'
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  return (
    <article className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon name="Briefcase" size={22} className="text-primary" />
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          {formatDate(job.postedDate)}
        </span>
      </div>

      <h3 className="mb-1 text-base font-semibold text-foreground line-clamp-2">
        {job.title}
      </h3>

      <p className="mb-1 text-sm font-medium text-primary">{job.company}</p>

      <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
        <Icon name="MapPin" size={12} />
        <span>{job.location}</span>
      </div>

      {job.salary !== 'Salary not listed' && (
        <div className="mb-3 flex items-center gap-1 text-xs font-medium text-success">
          <Icon name="DollarSign" size={12} />
          <span>{job.salary}</span>
        </div>
      )}

      <p className="mb-4 flex-1 text-xs leading-5 text-muted-foreground line-clamp-3">
        {job.description}
      </p>

        <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Apply Now
        <Icon name="ExternalLink" size={14} />
      </a>
    </article>
  )
}

export default HiringsPage