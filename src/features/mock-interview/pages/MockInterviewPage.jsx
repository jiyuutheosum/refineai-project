import { useState, useEffect } from 'react'
import { useAppSelector } from '@/app/store/hooks'
import Button from '@/shared/components/ui/Button'
import Icon from '@/shared/components/AppIcon'
import ProgressIndicator from '@/shared/components/feedback/ProgressIndicator'
import { generateMockInterviewQuestions } from '../services/interview.api'
import { getUserResumes } from '@/features/resume-upload/services/resumeUpload.api'

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
  const [expandedId, setExpandedId] = useState(null)

  const user = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const userResumes = await getUserResumes()
        setResumes(userResumes.filter(r => r.analysisStatus === 'completed'))
      } catch (err) {
        console.error(err)
      }
    }
    if (user) loadResumes()
  }, [user])

  const handleGenerateQuestions = async () => {
    if (!selectedResumeId) return

    const selectedResume = resumes.find(r => (r.resumeId || r.id) === selectedResumeId)
    if (!selectedResume) return

    setLoading(true)
    setError(null)
    setQuestions([])

    try {
      const resumeText = selectedResume.editedResumeText || 
        `${selectedResume.fileName} - Skills and experience from resume analysis`

      const generated = await generateMockInterviewQuestions(
        resumeText, 
        selectedResume.targetRole || ''
      )

      setQuestions(generated)
    } catch (err) {
      setError(err.message || 'Failed to generate interview questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const groupedQuestions = questions.reduce((acc, q) => {
    const category = q.category || 'General'
    if (!acc[category]) acc[category] = []
    acc[category].push(q)
    return acc
  }, {})

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
            <h2 className="text-lg font-semibold mb-4">Select a Resume</h2>
            
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
                  disabled={!selectedResumeId || loading}
                  className="min-w-[160px]"
                >
                  {loading ? 'Generating...' : 'Generate Questions'}
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
                <span className="text-sm text-muted-foreground">{questions.length} questions generated</span>
              </div>

              {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
                <div key={category} className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="rounded-md bg-primary/10 px-2.5 py-1 text-sm text-primary">{category}</span>
                  </h3>

                  <div className="space-y-4">
                    {categoryQuestions.map((q, index) => {
                      const isExpanded = expandedId === q.id
                      return (
                        <div key={q.id || index} className="rounded-2xl border bg-card p-5">
                          <button
                            onClick={() => toggleExpand(q.id || index)}
                            className="w-full text-left flex justify-between items-start gap-4"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-foreground pr-4">{q.question}</p>
                            </div>
                            <Icon 
                              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                              size={20} 
                              className="text-muted-foreground mt-0.5 flex-shrink-0" 
                            />
                          </button>

                          {isExpanded && (
                            <div className="mt-4 border-t pt-4 space-y-4">
                              {q.why_asked && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1">WHY THIS QUESTION?</p>
                                  <p className="text-sm text-foreground">{q.why_asked}</p>
                                </div>
                              )}

                              {q.suggested_talking_points?.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-2">SUGGESTED TALKING POINTS</p>
                                  <ul className="space-y-1.5 text-sm">
                                    {q.suggested_talking_points.map((point, i) => (
                                      <li key={i} className="flex gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {questions.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              Select a resume above and click "Generate Questions" to get started.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MockInterviewPage
