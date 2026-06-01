import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { loadResumeDetail, clearSelectedResume } from '../store/myResumesSlice'
import Icon from '@/shared/components/AppIcon'
import Button from '@/shared/components/ui/Button'
import { TemplatePreview } from '@/features/manual-resume-editor/components/TemplatePreview'
import { exportResumeToReactPDF } from '@/features/manual-resume-editor/utils/exportResumeToReactPDF'
import InterviewQuestionsList from '@/features/mock-interview/components/InterviewQuestionsList'

function ResumeDetailPage() {
  const { resumeId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { selectedResume, selectedFeedback, detailStatus, error } =
    useAppSelector((state) => state.myResumes)

  // PDF Export state
  const [isExporting, setIsExporting] = useState(false)
  const [exportMessage, setExportMessage] = useState(null) // { type: 'success'|'error', text: string }

  useEffect(() => {
    if (resumeId) {
      dispatch(loadResumeDetail(resumeId))
    }
    return () => {
      dispatch(clearSelectedResume())
    }
  }, [dispatch, resumeId])

  const score = selectedResume?.overallScore || selectedFeedback?.overallScore || 0
  const canViewHirings = score >= 80
  const isAnalyzed = Boolean(selectedFeedback)

  // Show edited template preview when the user has previously saved manual edits
  const hasManualEdits = Boolean(selectedResume?.hasManualEdits && selectedResume?.editedSections)
  const editedSections = selectedResume?.editedSections ?? {}
  const savedTemplate = selectedResume?.selectedTemplate ?? 'classic'

  // Mock interview questions (persisted on the resume doc)
  const mockQuestions = selectedResume?.mockQuestions || []
  const hasMockQuestions = mockQuestions.length > 0
  const mockGeneratedAt = selectedResume?.mockQuestionsGeneratedAt

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-warning'
    return 'text-destructive'
  }

  const getScoreRingColor = (score) => {
    if (score >= 80) return 'border-success'
    return 'border-destructive'
  }

  const getSeverityColor = (severity) => {
    if (severity === 'high') return 'bg-destructive'
    if (severity === 'medium') return 'bg-warning'
    return 'bg-success'
  }

  const handleEditResume = () => {
    navigate(`/my-resumes/${resumeId}/edit`, {
      state: {
        resume: selectedResume,
        feedback: selectedFeedback,
      },
    })
  }

  const handleDownloadPDF = async () => {
    if (!hasManualEdits) {
      setExportMessage({ type: 'error', text: 'No edited resume available to export.' })
      return
    }

    setIsExporting(true)
    setExportMessage(null)

    try {
      await exportResumeToReactPDF({
        resume: editedSections,
        templateId: savedTemplate,
        originalFileName: selectedResume.fileName || selectedResume.originalFileName || '',
      })

      setExportMessage({ type: 'success', text: 'PDF downloaded successfully.' })
    } catch (err) {
      setExportMessage({
        type: 'error',
        text: err?.message || 'Failed to generate PDF. Please try again.',
      })
    } finally {
      setIsExporting(false)
      setTimeout(() => {
        setExportMessage((current) =>
          current?.type === 'success' ? null : current
        )
      }, 3200)
    }
  }

  if (detailStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (detailStatus === 'failed') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-center">
        <div>
          <p className="mb-4 text-destructive">{error}</p>
          <Button onClick={() => navigate('/my-resumes')}>
            Back to My Resumes
          </Button>
        </div>
      </div>
    )
  }

  if (!selectedResume) return null

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
            <Button variant="outline" onClick={() => navigate('/my-resumes')}>
              <Icon name="ArrowLeft" size={16} />
              Back
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {selectedResume.fileName}
              </h1>
              <p className="text-sm text-muted-foreground">
                Uploaded{' '}
                {new Date(
                  selectedResume.uploadDate || selectedResume.createdAt
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              {isAnalyzed && (
                <Button variant="outline" onClick={handleEditResume}>
                  <Icon name="Pencil" size={16} />
                  Edit Resume
                </Button>
              )}

              {hasManualEdits && (
                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  disabled={isExporting}
                  loading={isExporting}
                >
                  <Icon name="Download" size={16} />
                  Download PDF
                </Button>
              )}

              <Button
                variant={canViewHirings ? 'default' : 'outline'}
                disabled={!canViewHirings}
                onClick={() => navigate('/hirings', { state: { score } })}
                title={
                  !canViewHirings
                    ? 'Resume score must be 80+ to access hirings'
                    : 'View job matches'
                }
              >
                <Icon name="BriefcaseBusiness" size={16} />
                {canViewHirings ? 'View Hirings' : 'Score 80+ Required'}
              </Button>
            </div>
          </div>

          {/* Export status message */}
          {exportMessage && (
            <div
              className={`mb-6 rounded-xl border px-4 py-3 text-sm flex items-center gap-2 ${
                exportMessage.type === 'success'
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-destructive/30 bg-destructive/10 text-destructive'
              }`}
            >
              <Icon
                name={exportMessage.type === 'success' ? 'CheckCircle2' : 'AlertCircle'}
                size={16}
              />
              <span>{exportMessage.text}</span>
              <button
                onClick={() => setExportMessage(null)}
                className="ml-auto text-xs underline opacity-70 hover:opacity-100"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: resume preview — shows edited template or original PDF */}
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-2">
                  <Icon name="FileText" size={18} className="text-primary" />
                  <span className="font-semibold text-foreground">
                    Resume Preview
                  </span>
                  {hasManualEdits && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Edited
                    </span>
                  )}
                </div>

                {/* Only show "Open original" link when showing the edited version */}
                {hasManualEdits ? (
                  <button
                    onClick={() => window.open(selectedResume.downloadURL, '_blank')}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon name="ExternalLink" size={12} />
                    View original
                  </button>
                ) : (
                  <a
                    href={selectedResume.downloadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Icon name="ExternalLink" size={12} />
                    Open in new tab
                  </a>
                )}
              </div>

              {hasManualEdits ? (
                // Show the saved edited content in the chosen template
                <div className="overflow-auto" style={{ height: '700px' }}>
                  <TemplatePreview
                    templateId={savedTemplate}
                    resume={editedSections}
                  />
                </div>
              ) : selectedResume.fileType === 'pdf' ? (
                <iframe
                  src={`${selectedResume.downloadURL}#toolbar=0`}
                  className="w-full"
                  style={{ height: '700px' }}
                  title="Resume Preview"
                />
              ) : (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(
                    selectedResume.downloadURL
                  )}&embedded=true`}
                  className="w-full"
                  style={{ height: '700px' }}
                  title="Resume Preview"
                />
              )}
            </div>

            {/* Right: feedback */}
            <div className="space-y-5">
              {selectedFeedback?.overallFeedback && (
                <div className="relative rounded-2xl border bg-card p-5 pr-36 shadow-sm">
                  {score > 0 && (
                    <div
                      className={`absolute right-5 top-5 flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 ${getScoreRingColor(
                        score
                      )}`}
                    >
                      <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                        {score}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Overall Score
                      </span>
                    </div>
                  )}

                  <h2 className="mb-3 text-lg font-semibold text-foreground">
                    Overall Feedback
                  </h2>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {selectedFeedback.overallFeedback}
                  </p>
                </div>
              )}

              {!selectedFeedback && (
                <div className="rounded-2xl border bg-muted/40 p-5 text-center">
                  <Icon
                    name="Clock"
                    size={24}
                    className="mx-auto mb-2 text-muted-foreground"
                  />
                  <p className="text-sm text-muted-foreground">
                    This resume hasn't been analyzed yet.
                  </p>
                  <Button className="mt-4" onClick={() => navigate('/')}>
                    Analyze Now
                  </Button>
                </div>
              )}

              {selectedFeedback?.sectionFeedback?.map((section, index) => (
                <div
                  key={index}
                  className="rounded-2xl border bg-card p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      {section.section}
                    </h3>
                    <span className={`text-lg font-bold ${getScoreColor(section.score)}`}>
                      {section.score}%
                    </span>
                  </div>

                  <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${section.score}%` }}
                    />
                  </div>

                  <p className="mb-3 text-sm text-muted-foreground">
                    {section.feedback}
                  </p>

                  {section.suggestions?.length > 0 && (
                    <ul className="space-y-2">
                      {section.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <span
                            className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${getSeverityColor(
                              s.severity
                            )}`}
                          />
                          <span className="text-foreground">{s.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mock Interview Questions — saved per resume */}
          <div className="mt-8 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Icon name="MessageCircle" size={20} className="text-primary" />
                  Mock Interview Questions
                </h2>
                {hasMockQuestions && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {mockQuestions.length} tailored questions
                    {mockGeneratedAt && (
                      <> · Generated {new Date(
                        mockGeneratedAt?.toDate ? mockGeneratedAt.toDate() : mockGeneratedAt
                      ).toLocaleDateString()}</>
                    )}
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  navigate('/mock-interview', {
                    state: { preselectResumeId: resumeId },
                  })
                }
              >
                <Icon name="Play" size={16} className="mr-2" />
                {hasMockQuestions ? 'Practice / Regenerate' : 'Open Mock Interview'}
              </Button>
            </div>

            {hasMockQuestions ? (
              <InterviewQuestionsList questions={mockQuestions} />
            ) : (
              <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
                <Icon name="HelpCircle" size={32} className="mx-auto mb-3 text-muted-foreground/70" />
                <p className="font-medium text-foreground mb-1">No mock questions yet for this resume</p>
                <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
                  Generate realistic behavioral, technical, and role-specific interview questions based on this resume's content and experience.
                </p>
                <Button
                  onClick={() =>
                    navigate('/mock-interview', {
                      state: { preselectResumeId: resumeId },
                    })
                  }
                >
                  <Icon name="Sparkles" size={16} className="mr-2" />
                  Generate Mock Interview Questions
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>


    </div>
  )
}

export default ResumeDetailPage
