import { useState, useEffect } from 'react'
import { useAppSelector } from '@/app/store/hooks'
import { useLocation } from 'react-router-dom'
import Button from '@/shared/components/ui/Button'
import Icon from '@/shared/components/AppIcon'
import ProgressIndicator from '@/shared/components/feedback/ProgressIndicator'
import { generateMockInterviewQuestions, saveMockInterviewQuestions } from '../services/interview.api'
import { getUserResumes } from '@/features/resume-upload/services/resumeUpload.api'
import InterviewQuestionsList from '../components/InterviewQuestionsList'
import UsageQuota from '@/shared/components/UsageQuota'

const workflowState = {
  completedPhases: ['upload', 'analysis', 'editor', 'summary', 'hirings'],
  currentPhase: 'interview',
}

function MockInterviewPage() {
  const [resumes, setResumes] = useState([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentUsage, setCurrentUsage] = useState(null)

  const user = useAppSelector((state) => state.auth.user)
  const location = useLocation()

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const userResumes = await getUserResumes()
        const analyzed = userResumes.filter(r => r.analysisStatus === 'completed')
        setResumes(analyzed)

        // Support deep-link from My Resumes detail page
        const preselectId = location.state?.preselectResumeId
        if (preselectId) {
          // Will be picked up by the selection effect below once resumes are set
          setSelectedResumeId(preselectId)
        }
      } catch (err) {
        setError('Failed to load your resumes. Please refresh the page.')
      }
    }
    if (user) loadResumes()
  }, [user, location.state])

  // When selected resume changes (incl. preselect or manual dropdown), auto-show any previously saved questions
  useEffect(() => {
    if (!selectedResumeId) {
      setQuestions([])
      return
    }
    const selected = resumes.find(r => (r.resumeId || r.id) === selectedResumeId)
    if (selected?.mockQuestions?.length > 0) {
      setQuestions(selected.mockQuestions)
    } else {
      setQuestions([])
    }
  }, [selectedResumeId, resumes])

  const handleGenerateQuestions = async () => {
    if (!selectedResumeId) return

    const selectedResume = resumes.find(r => (r.resumeId || r.id) === selectedResumeId)
    if (!selectedResume) return

    setLoading(true)
    setError(null)
    // We intentionally do NOT clear questions here so the UI keeps previous until new ones arrive

    try {
      const resumeText = selectedResume.editedResumeText || 
        `${selectedResume.fileName} - Skills and experience from resume analysis`

      const generated = await generateMockInterviewQuestions(
        resumeText, 
        selectedResume.targetRole || ''
      )

      setQuestions(generated)

      // Persist so they appear in My Resumes detail view + future visits
      await saveMockInterviewQuestions(selectedResumeId, generated)

      // Update local resumes list so the "auto-load saved" effect + UI reflects immediately
      setResumes(prev =>
        prev.map(r => {
          const id = r.resumeId || r.id
          if (id === selectedResumeId) {
            return {
              ...r,
              mockQuestions: generated,
              mockQuestionsGeneratedAt: new Date().toISOString(),
            }
          }
          return r
        })
      )
    } catch (err) {
      if (err.code === 'RATE_LIMIT_EXCEEDED' || err.status === 429) {
        setError('You have reached your daily mock interview limit. Quota resets at midnight UTC.')
      } else {
        setError(err.message || 'Failed to generate interview questions. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator workflowState={workflowState} />

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Mock Interview Practice</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Generate realistic interview questions tailored to your resume and experience.
            </p>
          </header>

          {/* Resume Selection */}
          <div className="mb-8 rounded-2xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Select a Resume</h2>
              <UsageQuota compact onData={setCurrentUsage} />
            </div>
            
            {resumes.length === 0 ? (
              <p className="text-muted-foreground">You don't have any analyzed resumes yet. Upload or build one first.</p>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm"
                  >
                    <option value="">-- Select a resume --</option>
                    {resumes.map((resume) => {
                      const id = resume.resumeId || resume.id
                      return (
                        <option key={id} value={id}>
                          {resume.fileName || resume.originalFileName} (Score: {resume.overallScore || 'N/A'})
                        </option>
                      )
                    })}
                  </select>
                </div>
                <Button 
                  onClick={handleGenerateQuestions} 
                  disabled={!selectedResumeId || loading || (currentUsage?.remaining?.mockInterview ?? 1) <= 0}
                  className="min-w-[160px]"
                >
                  {loading 
                    ? 'Generating...' 
                    : (currentUsage?.remaining?.mockInterview ?? 1) <= 0
                      ? 'No mocks remaining today'
                      : (resumes.find(r => (r.resumeId || r.id) === selectedResumeId)?.mockQuestions?.length 
                          ? 'Regenerate Questions' 
                          : 'Generate Questions')}
                </Button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
              {error}
            </div>
          )}

          {/* Questions Display */}
          {questions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Interview Questions</h2>
                <span className="text-sm text-muted-foreground">{questions.length} questions</span>
              </div>

              <InterviewQuestionsList questions={questions} />
            </div>
          )}

          {questions.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              {selectedResumeId 
                ? 'Click "Generate Questions" (or Regenerate) to create and save tailored interview questions for this resume.'
                : 'Select a resume above and click "Generate Questions" to get started.'}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MockInterviewPage
