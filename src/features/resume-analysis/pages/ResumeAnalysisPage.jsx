import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { analyzeResume } from '../store/analysisSlice'
import { setSummaryData } from '@/features/feedback-summary/store/feedbackSlice'
import ProgressIndicator from '@/shared/components/feedback/ProgressIndicator'
import Button from '@/shared/components/ui/Button'
import Icon from '@/shared/components/AppIcon'

const workflowState = {
  completedPhases: ['upload'],
  currentPhase: 'analysis',
}

function transformToSummaryData(overallScore, sectionFeedback) {
  if (!sectionFeedback || sectionFeedback.length === 0) return null

  const categoryScores = sectionFeedback.map((section) => ({
    title: section.section,
    name: section.section,
    score: section.score,
    description: section.feedback,
  }))

  const sectionBreakdowns = sectionFeedback.map((section) => ({
    title: section.section,
    name: section.section,
    score: section.score,
    feedback: section.feedback,
    issues: (section.suggestions || []).map((s) => ({
      text: s.text,
      severity: s.severity,
    })),
  }))

  const priorityActions = []

  sectionFeedback.forEach((section) => {
    ;(section.suggestions || [])
      .filter((s) => s.severity === 'high' || s.severity === 'medium')
      .forEach((s) => {
        priorityActions.push({
          title: s.text,
          description: `From ${section.section} — ${section.feedback}`,
          severity: s.severity,
          section: section.section,
        })
      })
  })

  const strengths = sectionFeedback.filter((s) => s.score >= 75).length
  const improvements = sectionFeedback.filter((s) => s.score < 75).length
  const totalIssues = priorityActions.length

  const educationalResources = sectionFeedback
    .filter((s) => s.score < 75)
    .slice(0, 4)
    .map((section) => ({
      title: `Improve Your ${section.section}`,
      name: `Improve Your ${section.section}`,
      description: `Learn how to strengthen your ${section.section.toLowerCase()} section for better results.`,
      type: 'guide',
      url: '#',
    }))

  return {
    overallScore,
    totalIssues,
    strengths,
    improvements,
    categoryScores,
    sectionBreakdowns,
    priorityActions,
    educationalResources,
  }
}

function getStoredReanalysisPayload() {
  try {
    const rawPayload = sessionStorage.getItem('resumeReanalysisPayload')
    return rawPayload ? JSON.parse(rawPayload) : null
  } catch {
    return null
  }
}

function ResumeAnalysisPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const storedPayload = useMemo(() => getStoredReanalysisPayload(), [])

  const { currentResume: reduxCurrentResume } = useAppSelector(
    (state) => state.resumeUpload
  )

  const currentResume =
    reduxCurrentResume || location.state?.resume || storedPayload?.resume

  const {
    overallScore,
    overallFeedback,
    sectionFeedback,
    status,
    error,
  } = useAppSelector((state) => state.analysis)

  const file = location.state?.file

  const editedResumeText =
    location.state?.editedResumeText || storedPayload?.editedResumeText

  const isReanalysis = Boolean(
    (location.state?.reanalyze || storedPayload?.reanalyze) && editedResumeText
  )

  useEffect(() => {
    if (!currentResume) {
      navigate('/', { replace: true })
      return
    }

    if (!file && !isReanalysis && status !== 'succeeded') {
      navigate('/', { replace: true })
      return
    }

    if (status !== 'idle') return

    dispatch(
      analyzeResume({
        resumeId: currentResume.resumeId || currentResume.id,
        file,
        uid: currentResume.uid,
        resumeText: editedResumeText,
      })
    )
  }, [
    dispatch,
    currentResume,
    file,
    editedResumeText,
    isReanalysis,
    navigate,
    status,
  ])

  useEffect(() => {
    if (status === 'succeeded') {
      sessionStorage.removeItem('resumeReanalysisPayload')
    }
  }, [status])

  useEffect(() => {
    if (status !== 'succeeded') return
    if (!sectionFeedback || sectionFeedback.length === 0) return

    const summaryData = transformToSummaryData(overallScore, sectionFeedback)

    if (summaryData) {
      dispatch(setSummaryData(summaryData))
    }
  }, [status, overallScore, sectionFeedback, dispatch])

  if (!currentResume) return null
  if (!file && !isReanalysis && status !== 'succeeded') return null

  const analysisItems =
    sectionFeedback.length > 0
      ? sectionFeedback.map((section) => ({
          title: section.section,
          score: section.score,
          description: section.feedback,
        }))
      : [
          {
            title: 'Contact Information',
            score: 0,
            description: 'Analyzing...',
          },
          {
            title: 'Professional Summary',
            score: 0,
            description: 'Analyzing...',
          },
          {
            title: 'Work Experience',
            score: 0,
            description: 'Analyzing...',
          },
          {
            title: 'Skills',
            score: 0,
            description: 'Analyzing...',
          },
        ]

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <ProgressIndicator workflowState={workflowState} />

        <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            <p className="mb-2 text-lg font-medium text-foreground">
              {isReanalysis
                ? 'Re-analyzing your updated resume...'
                : 'Analyzing your resume...'}
            </p>
            <p className="text-sm text-muted-foreground">
              This takes about 10–20 seconds
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-background">
        <ProgressIndicator workflowState={workflowState} />

        <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
          <div className="text-center">
            <p className="mb-2 font-medium text-destructive">
              Analysis failed
            </p>

            <p className="mb-6 text-sm text-muted-foreground">
              {error || 'Something went wrong while analyzing your resume.'}
            </p>

            <Button onClick={() => navigate('/')}>Upload Again</Button>
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

          <div className="mb-6 flex items-center gap-3 rounded-xl border bg-muted/40 px-5 py-3 text-sm text-muted-foreground">
            <Icon name="FileText" size={16} />

            <span>
              Analyzing:{' '}
              <span className="font-medium text-foreground">
                {currentResume.fileName || currentResume.originalFileName}
              </span>
            </span>

            {isReanalysis && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Updated Resume
              </span>
            )}

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
                  <span className="text-sm text-muted-foreground">
                    Overall Score
                  </span>
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
                        : 'Analysis complete'}
                </h2>

                <p className="mt-3 leading-7 text-muted-foreground">
                  {overallFeedback ||
                    'Your resume has been analyzed. See the breakdown below.'}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to="/manual-resume-editor">
                      <Icon name="Edit3" size={18} />
                      Improve Resume
                    </Link>
                  </Button>

                  <Button variant="outline" asChild>
                    <Link to="/feedback-summary">View Full Feedback</Link>
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