import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

import { useFeedbackSummary } from '../hooks/useFeedbackSummary'
import { HELP_CONTENT } from '../constants'
import { calculateProgress } from '../utils'

const workflowState = {
  completedPhases: ['/resume-upload', '/resume-analysis', '/manual-resume-editor'],
}

function FeedbackSummaryPage() {
  const navigate = useNavigate()
  const { summaryData, status } = useFeedbackSummary()
  const [checkedActions, setCheckedActions] = useState(() => new Set())

  // Get real file data from Redux instead of hardcoded mock
  const { currentResume } = useAppSelector((state) => state.resumeUpload)

  const priorityActions = summaryData?.priorityActions ?? []
  const categoryScores = summaryData?.categoryScores ?? []
  const sectionBreakdowns = summaryData?.sectionBreakdowns ?? []
  const educationalResources = summaryData?.educationalResources ?? []

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

  const handleReupload = () => {
    navigate('/')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <main className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading feedback summary...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator workflowState={workflowState} />s
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
                Resume: <span className="font-medium text-foreground">{currentResume.fileName}</span>
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
            score={summaryData?.overallScore}
            totalIssues={summaryData?.totalIssues}
            strengths={summaryData?.strengths}
            improvements={summaryData?.improvements}
          />

          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground md:mb-6 md:text-2xl">
              Category Breakdown
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {categoryScores.map((category) => (
                <ScoreCard key={category.title ?? category.name} {...category} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between md:mb-6">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">
                Priority Actions
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="CheckCircle2" size={16} className="text-success" />
                <span>{checkedActions.size} of {priorityActions.length} completed</span>
              </div>
            </div>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="space-y-3 md:space-y-4">
              {priorityActions.map((action, index) => (
                <PriorityAction
                  key={action.title ?? index}
                  {...action}
                  onCheck={(isChecked) => handleActionCheck(index, isChecked)}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground md:mb-6 md:text-2xl">
              Section Analysis
            </h2>
            <div className="space-y-3 md:space-y-4">
              {sectionBreakdowns.map((section) => (
                <SectionBreakdown key={section.title ?? section.name} {...section} />
              ))}
            </div>
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
                    Continue improving your resume.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
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

export default FeedbackSummaryPage