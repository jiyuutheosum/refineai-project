import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { fetchFeedback } from '@/features/feedback-summary/store/feedbackSlice'
import ProgressIndicator from '@/shared/components/feedback/ProgressIndicator'
import Button from '@/shared/components/ui/Button'
import Icon from '@/shared/components/AppIcon'

const workflowState = {
  completedPhases: ['upload'],
  currentPhase: 'analysis',
}

function ResumeAnalysisPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { currentResume } = useAppSelector((state) => state.resumeUpload)
  const { overallScore, status, error } = useAppSelector((state) => state.feedback)

  useEffect(() => {
    // If no resume in store, send user back to upload
    if (!currentResume) {
      navigate('/', { replace: true })
      return
    }

    // Fetch feedback/analysis for this resume
    if (currentResume?.resumeId || currentResume?.id) {
      dispatch(fetchFeedback(currentResume.resumeId || currentResume.id))
    }
  }, [dispatch, currentResume, navigate])

  // Don't render anything while redirecting
  if (!currentResume) return null

  const analysisItems = [
    {
      title: 'Content Quality',
      score: overallScore > 0 ? Math.min(overallScore + 10, 100) : 0,
      description: 'Your resume content is clear, relevant, and mostly well-structured.',
    },
    {
      title: 'Keyword Match',
      score: overallScore > 0 ? Math.min(overallScore + 4, 100) : 0,
      description: 'Your resume includes several strong keywords, but could use more role-specific terms.',
    },
    {
      title: 'Formatting',
      score: overallScore > 0 ? Math.min(overallScore + 16, 100) : 0,
      description: 'The layout is readable and consistent with minor spacing improvements needed.',
    },
    {
      title: 'Impact Statements',
      score: overallScore > 0 ? Math.max(overallScore - 1, 0) : 0,
      description: 'Some bullet points can be improved by adding measurable outcomes.',
    },
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <ProgressIndicator workflowState={workflowState} />
        <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Analyzing your resume...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => navigate('/')}>Try Again</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator workflowState={workflowState} />

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 text-center">
            <p className="mb-3 text-sm font-medium text-primary">
              Resume Analysis
            </p>

            <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Your Resume Review Is Ready
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Review your resume score, identify improvement areas, and continue
              to the editor to refine your resume.
            </p>
          </header>

          {/* File info banner */}
          <div className="mb-6 flex items-center gap-3 rounded-xl border bg-muted/40 px-5 py-3 text-sm text-muted-foreground">
            <Icon name="FileText" size={16} />
            <span>
              Analyzing: <span className="font-medium text-foreground">{currentResume.fileName}</span>
            </span>
            <span className="ml-auto">
              {currentResume.fileSize
                ? `${(currentResume.fileSize / 1024).toFixed(1)} KB`
                : ''}
            </span>
          </div>

          <section className="mb-10 rounded-2xl border bg-card p-6 shadow-sm md:p-8">
            <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
              <div className="flex justify-center">
                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-8 border-primary/20 bg-primary/5">
                  <span className="text-5xl font-bold text-primary">
                    {overallScore || 0}
                  </span>
                  <span className="text-sm text-muted-foreground">Overall Score</span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {overallScore >= 70
                    ? 'Strong foundation with room to improve'
                    : overallScore >= 50
                    ? 'Good start, but needs refinement'
                    : overallScore > 0
                    ? 'Consider major improvements'
                    : 'Analysis in progress'}
                </h2>

                <p className="mt-3 leading-7 text-muted-foreground">
                  Your resume is readable and structured well, but it can be
                  strengthened with more measurable achievements, clearer impact
                  statements, and stronger keyword alignment.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to="/manual-resume-editor">
                      <Icon name="Edit3" size={18} />
                      Improve Resume
                    </Link>
                  </Button>

                  <Button variant="outline" asChild>
                    <Link to="/feedback-summary">
                      View Full Feedback
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            {analysisItems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>

                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {item.score || 0}%
                  </span>
                </div>

                <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${item.score || 0}%` }}
                  />
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}

export default ResumeAnalysisPage