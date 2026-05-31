import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/app/store/hooks'

import ProgressIndicator from '../../../shared/components/feedback/ProgressIndicator'
import HelpContext from '../../../shared/components/ui/HelpContext'
import Button from '@/shared/components/ui/Button'
import Icon from '../../../shared/components/AppIcon'

import OverallScore from '../components/OverallScore'
import ScoreCard from '../components/ScoreCard'
import SectionBreakdown from '../components/SectionBreakdown'
import PriorityAction from '../components/PriorityAction'
import ResourceCard from '../components/ResourceCard'
import ExportOptions from '../components/ExportOptions'

import { HELP_CONTENT } from '../constants'
import { calculateProgress } from '../utils'

const workflowState = {
  completedPhases: ['/resume-upload', '/resume-analysis', '/manual-resume-editor'],
  currentPhase: 'feedback-summary',
}

function FeedbackSummaryPage() {
  const navigate = useNavigate()
  const [checkedActions, setCheckedActions] = useState(() => new Set())

  const { currentResume } = useAppSelector((state) => state.resumeUpload)
  const {
    overallScore,
    overallFeedback,
    sectionFeedback,
    status: analysisStatus,
  } = useAppSelector((state) => state.analysis)

  const hasAnalysis =
    overallScore > 0 ||
    Boolean(overallFeedback) ||
    sectionFeedback?.length > 0 ||
    analysisStatus === 'succeeded'

  const summaryData = useMemo(() => {
    const sections = Array.isArray(sectionFeedback) ? sectionFeedback : []

    const strengths = sections.filter((section) => Number(section.score) >= 80).length
    const improvements = sections.filter((section) => Number(section.score) < 80).length

    const priorityActions = sections.flatMap((section) =>
      (section.suggestions || [])
        .filter((suggestion) => suggestion?.text)
        .map((suggestion) => ({
          title: section.section,
          description: suggestion.text,
          severity: suggestion.severity || 'medium',
          category: section.section,
        }))
    )

    const totalIssues = priorityActions.length

    const categoryScores = sections.map((section) => ({
      title: section.section,
      name: section.section,
      score: Number(section.score) || 0,
      description: section.feedback || 'No feedback available.',
      icon: getSectionIcon(section.section),
    }))

    const sectionBreakdowns = sections.map((section) => ({
      title: section.section,
      name: section.section,
      score: Number(section.score) || 0,
      feedback: section.feedback || 'No feedback available.',
      suggestions: section.suggestions || [],
    }))

    return {
      overallScore: Number(overallScore) || 0,
      overallFeedback: overallFeedback || '',
      totalIssues,
      strengths,
      improvements,
      categoryScores,
      sectionBreakdowns,
      priorityActions,
      educationalResources: getEducationalResources(),
    }
  }, [overallScore, overallFeedback, sectionFeedback])

  const priorityActions = summaryData.priorityActions
  const categoryScores = summaryData.categoryScores
  const sectionBreakdowns = summaryData.sectionBreakdowns
  const educationalResources = summaryData.educationalResources
  const score = summaryData.overallScore

  const progress = useMemo(
    () => calculateProgress(checkedActions.size, priorityActions.length),
    [checkedActions.size, priorityActions.length]
  )

  const handleActionCheck = (index, isChecked) => {
    setCheckedActions((currentActions) => {
      const nextActions = new Set(currentActions)

      if (isChecked) {
        nextActions.add(index)
      } else {
        nextActions.delete(index)
      }

      return nextActions
    })
  }

  const handleExport = (type, email) => {
    console.log('Export requested:', { type, email })
  }

  if (!hasAnalysis) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator workflowState={workflowState} />

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
        <header className="mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2 md:p-3">
              <Icon name="FileText" size={24} className="text-primary md:h-7 md:w-7" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
                Feedback Summary
              </h1>

              <p className="mt-1 text-sm text-muted-foreground md:text-base">
                Comprehensive analysis of your resume with actionable insights.
              </p>
            </div>
          </div>

          {currentResume && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border bg-muted/40 px-5 py-3 text-sm text-muted-foreground">
              <Icon name="FileText" size={16} />
              <span>
                Resume:{' '}
                <span className="font-medium text-foreground">
                  {currentResume.fileName}
                </span>
              </span>

              {currentResume.fileSize && (
                <span className="ml-auto">
                  {(currentResume.fileSize / 1024).toFixed(1)} KB
                </span>
              )}
            </div>
          )}
        </header>

        <div className="space-y-6 md:space-y-8">
          <OverallScore
            score={score}
            totalIssues={summaryData.totalIssues}
            strengths={summaryData.strengths}
            improvements={summaryData.improvements}
          />

          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground md:mb-6 md:text-2xl">
              Category Breakdown
            </h2>

            {categoryScores.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {categoryScores.map((category) => (
                  <ScoreCard key={category.title ?? category.name} {...category} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
                No category scores available.
              </div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between md:mb-6">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">
                Priority Actions
              </h2>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="CheckCircle2" size={16} className="text-success" />
                <span>
                  {checkedActions.size} of {priorityActions.length} completed
                </span>
              </div>
            </div>

            <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {priorityActions.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {priorityActions.map((action, index) => (
                  <PriorityAction
                    key={`${action.title}-${index}`}
                    {...action}
                    onCheck={(isChecked) => handleActionCheck(index, isChecked)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
                No priority actions found. Your resume may already be in great shape!
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground md:mb-6 md:text-2xl">
              Section Analysis
            </h2>

            {sectionBreakdowns.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {sectionBreakdowns.map((section) => (
                  <SectionBreakdown key={section.title ?? section.name} {...section} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
                No section feedback available.
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground md:mb-6 md:text-2xl">
              Educational Resources
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {educationalResources.map((resource) => (
                <ResourceCard key={resource.title ?? resource.name} {...resource} />
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            <ExportOptions onExport={handleExport} />

            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-secondary/10 p-2">
                  <Icon name="ArrowRight" size={20} className="text-secondary" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground md:text-lg">
                    Next Steps
                  </h3>

                  <p className="text-xs text-muted-foreground md:text-sm">
                    {score >= 80
                      ? 'Your resume is ready for job applications!'
                      : 'Continue improving your resume.'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {score >= 80 ? (
                  <>
                    <Button
                      variant="default"
                      onClick={() => navigate('/hirings', { state: { score } })}
                      fullWidth
                      className="bg-success hover:bg-success/90 text-white"
                    >
                      <Icon name="Briefcase" size={18} className="mr-2" />
                      Proceed to Hirings
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => navigate('/mock-interview')}
                      fullWidth
                    >
                      <Icon name="MessageCircle" size={18} className="mr-2" />
                      Practice Mock Interview
                    </Button>
                  </>
                ) : (
                  <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                    <Icon name="Lock" size={16} className="mr-2 inline" />
                    Score 80+ required to unlock Hirings
                    <span className="ml-1 font-medium text-foreground">
                      Current: {score}/100
                    </span>
                  </div>
                )}

                <Button onClick={() => navigate('/manual-resume-editor')} fullWidth>
                  Edit Resume
                </Button>

                <Button variant="outline" onClick={() => navigate('/resume-analysis')} fullWidth>
                  View Detailed Analysis
                </Button>

                <Button variant="outline" onClick={() => navigate('/')} fullWidth>
                  Analyze New Resume
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-primary/20 bg-primary/5 p-4 md:p-6">
            <div className="flex items-start gap-3">
              <Icon name="Lightbulb" size={20} className="mt-1 flex-shrink-0 text-primary" />

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground md:text-lg">
                  Pro Tip: Iterative Improvement
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  Resume improvement is an ongoing process. Focus on implementing
                  2-3 priority actions at a time, then re-analyze to see your progress.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <HelpContext helpContent={HELP_CONTENT} />
    </div>
  )
}

function getSectionIcon(sectionName = '') {
  const name = sectionName.toLowerCase()

  if (name.includes('personal')) return 'User'
  if (name.includes('summary')) return 'FileText'
  if (name.includes('experience')) return 'Briefcase'
  if (name.includes('education')) return 'GraduationCap'
  if (name.includes('skills')) return 'Sparkles'
  if (name.includes('certification') || name.includes('seminar')) return 'Award'

  return 'FileText'
}

function getEducationalResources() {
  return [
    {
      title: 'Use measurable achievements',
      name: 'Use measurable achievements',
      description: 'Add numbers, percentages, scope, or outcomes to make your resume stronger.',
      icon: 'BarChart3',
      type: 'article',
      link: 'https://www.indeed.com/career-advice/resumes-cover-letters/how-to-quantify-resume-achievements',
    },
    {
      title: 'Improve action verbs',
      name: 'Improve action verbs',
      description: 'Start bullets with strong verbs like built, led, improved, created, or optimized.',
      icon: 'Zap',
      type: 'article',
      link: 'https://www.indeed.com/career-advice/resumes-cover-letters/action-verbs-for-resumes',
    },
    {
      title: 'Tailor your resume',
      name: 'Tailor your resume',
      description: 'Match your skills and experience to the job role you are targeting.',
      icon: 'Target',
      type: 'article',
      link: 'https://www.indeed.com/career-advice/resumes-cover-letters/how-to-tailor-your-resume',
    },
    {
      title: 'Keep formatting clean',
      name: 'Keep formatting clean',
      description: 'Use consistent spacing, sections, and readable formatting for ATS compatibility.',
      icon: 'Layout',
      type: 'article',
      link: 'https://www.indeed.com/career-advice/resumes-cover-letters/ats-friendly-resume-format',
    },
  ]
}

export default FeedbackSummaryPage