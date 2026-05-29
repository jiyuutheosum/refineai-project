import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { loadResumeDetail, clearSelectedResume } from '../store/myResumesSlice'
import Icon from '@/shared/components/AppIcon'
import Button from '@/shared/components/ui/Button'

function ResumeDetailPage() {
  const { resumeId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { selectedResume, selectedFeedback, detailStatus, error } =
    useAppSelector((state) => state.myResumes)

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
              {/* Edit Resume — only shown for analyzed resumes */}
              {isAnalyzed && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/my-resumes/${resumeId}/edit`)}
                >
                  <Icon name="Pencil" size={16} />
                  Edit Resume
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

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-2">
                  <Icon name="FileText" size={18} className="text-primary" />
                  <span className="font-semibold text-foreground">
                    Resume Preview
                  </span>
                </div>

                <a
                  href={selectedResume.downloadURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Icon name="ExternalLink" size={12} />
                  Open in new tab
                </a>
              </div>

              {selectedResume.fileType === 'pdf' ? (
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
        </div>
      </main>
    </div>
  )
}

export default ResumeDetailPage