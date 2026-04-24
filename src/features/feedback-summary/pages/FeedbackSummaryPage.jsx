import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../../shared/components/layout/Header'
import ProgressIndicator from '../../../shared/components/feedback/ProgressIndicator'
import FileStatus from '../../../shared/components/feedback/FileStatus'
import HelpContext from '../../../shared/components/ui/HelpContext'
import Button from '../../../shared/components/ui/Button'
import OverallScore from '../components/OverallScore'
import ScoreCard from '../components/ScoreCard'
import SectionBreakdown from '../components/SectionBreakdown'
import PriorityAction from '../components/PriorityAction'
import ResourceCard from '../components/ResourceCard'
import ExportOptions from '../components/ExportOptions'

import { useFeedbackSummary } from '../hooks/useFeedbackSummary'
import { HELP_CONTENT } from '../constants'
import { calculateProgress } from '../utils'

const FeedbackSummaryPage = () => {
  const navigate = useNavigate()
  const { summaryData, status } = useFeedbackSummary()

  const workflowState = {
    completedPhases: ['/resume-upload', '/resume-analysis', '/manual-resume-editor']
  }

  const fileContext = {
    fileName: 'Sarah_Johnson_Resume.pdf',
    fileSize: 2457600,
    uploadDate: new Date('2026-01-10T10:30:00'),
    processingStatus: 'complete',
    analysisComplete: true
  }

  const checkedActions = new Set()
  const progress = calculateProgress(checkedActions.size, summaryData.priorityActions?.length || 0)

  const handleActionCheck = (index, isChecked) => {
    // Hook action
  }

  const handleExport = (type, email) => {
    // Service call
  }

  const handleReupload = () => {
    navigate('/resume-upload')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProgressIndicator workflowState={workflowState} />
      <FileStatus 
        fileContext={fileContext}
        onReupload={handleReupload}
      />
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 p-2 md:p-3 rounded-xl">
              <Icon name="FileText" size={24} className="text-primary md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
                Feedback Summary
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Comprehensive analysis of your resume with actionable insights
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <OverallScore
            score={summaryData.overallScore}
            totalIssues={summaryData.totalIssues}
            strengths={summaryData.strengths}
            improvements={summaryData.improvements}
          />

          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4 md:mb-6">
              Category Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {summaryData.categoryScores?.map((category, index) => (
                <ScoreCard key={index} {...category} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">
                Priority Actions
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="CheckCircle2" size={16} className="text-success" />
                <span>{checkedActions.size} of {summaryData.priorityActions?.length} completed</span>
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              {summaryData.priorityActions?.map((action, index) => (
                <PriorityAction
                  key={index}
                  {...action}
                  onCheck={(isChecked) => handleActionCheck(index, isChecked)}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4 md:mb-6">
              Section Analysis
            </h2>
            <div className="space-y-3 md:space-y-4">
              {summaryData.sectionBreakdowns?.map((section, index) => (
                <SectionBreakdown key={index} {...section} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4 md:mb-6">
              Educational Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {summaryData.educationalResources?.map((resource, index) => (
                <ResourceCard key={index} {...resource} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <ExportOptions onExport={handleExport} />
            <div className="bg-card border border-border rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <Icon name="ArrowRight" size={20} className="text-secondary" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                    Next Steps
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Continue improving your resume
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  variant="default"
                  iconName="Edit"
                  iconPosition="left"
                  onClick={() => navigate('/manual-resume-editor')}
                  fullWidth
                >
                  Edit Resume
                </Button>
                <Button
                  variant="outline"
                  iconName="FileSearch"
                  iconPosition="left"
                  onClick={() => navigate('/resume-analysis')}
                  fullWidth
                >
                  View Detailed Analysis
                </Button>
                <Button
                  variant="outline"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={() => navigate('/resume-upload')}
                  fullWidth
                >
                  Analyze New Resume
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-6">
            <div className="flex items-start gap-3">
              <Icon name="Lightbulb" size={20} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">
                  Pro Tip: Iterative Improvement
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Resume improvement is an ongoing process. Focus on implementing 2-3 priority actions at a time, 
                  then re-analyze to see your progress. This iterative approach helps you learn resume writing 
                  principles while building a stronger application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <HelpContext helpContent={HELP_CONTENT} />
    </div>
  )
}

export default FeedbackSummaryPage

