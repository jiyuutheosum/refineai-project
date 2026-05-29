import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { resetAnalysis } from '@/features/resume-analysis/store/analysisSlice'

import ProgressIndicator from '@/shared/components/feedback/ProgressIndicator'
import Button from '@/shared/components/ui/Button'
import Icon from '@/shared/components/AppIcon'

const workflowState = {
  completedPhases: ['upload', 'analysis'],
  currentPhase: 'editor',
}

const emptyResume = {
  personalInfo: '',
  summary: '',
  experience: '',
  education: '',
  skills: '',
  seminarsAndCertificates: '',
}

function buildResumeText(resume) {
  return `
PERSONAL INFORMATION
${resume.personalInfo}

PROFESSIONAL SUMMARY
${resume.summary}

WORK EXPERIENCE
${resume.experience}

EDUCATION
${resume.education}

SKILLS
${resume.skills}

SEMINARS & CERTIFICATES
${resume.seminarsAndCertificates}
  `.trim()
}

function ManualResumeEditorPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  // Detect if we arrived from My Resumes (/my-resumes/:resumeId/edit)
  const fromMyResumes = location.pathname.startsWith('/my-resumes/')

  // Normal workflow sources
  const { sectionFeedback, extractedSections } = useAppSelector(
    (state) => state.analysis
  )
  const { currentResume } = useAppSelector((state) => state.resumeUpload)

  // My Resumes sources
  const { selectedResume, selectedFeedback } = useAppSelector(
    (state) => state.myResumes
  )

  const [resume, setResume] = useState(emptyResume)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (fromMyResumes) {
      // Prefer previously saved manual edits, fall back to original extracted sections
      const sections =
        selectedResume?.editedSections ||
        selectedResume?.extractedSections ||
        null

      if (!sections) return

      setResume({
        personalInfo: sections.personalInfo || '',
        summary: sections.summary || '',
        experience: sections.experience || '',
        education: sections.education || '',
        skills: sections.skills || '',
        seminarsAndCertificates: sections.seminarsAndCertificates || '',
      })
    } else {
      if (!extractedSections) return

      setResume({
        personalInfo: extractedSections.personalInfo || '',
        summary: extractedSections.summary || '',
        experience: extractedSections.experience || '',
        education: extractedSections.education || '',
        skills: extractedSections.skills || '',
        seminarsAndCertificates:
          extractedSections.seminarsAndCertificates || '',
      })
    }
  }, [fromMyResumes, extractedSections, selectedResume])

  // Resolve the active resume record and its feedback for display/saving
  const activeResume = fromMyResumes ? selectedResume : currentResume
  const activeSectionFeedback = fromMyResumes
    ? selectedFeedback?.sectionFeedback
    : sectionFeedback

  const editedResumeText = useMemo(() => buildResumeText(resume), [resume])

  const completionScore = useMemo(() => {
    const fields = Object.values(resume)
    const filled = fields.filter((value) => value.trim().length > 0)
    return Math.round((filled.length / fields.length) * 100)
  }, [resume])

  const showToast = (type, text) => {
    setMessage({ type, text })
    window.setTimeout(() => setMessage(null), 3000)
  }

  const getTipsForSection = (sectionName) => {
    if (!activeSectionFeedback || activeSectionFeedback.length === 0) return null

    const match = activeSectionFeedback.find((section) =>
      section.section?.toLowerCase().includes(sectionName.toLowerCase())
    )

    if (!match) return null

    return {
      feedback: match.feedback,
      suggestions: match.suggestions || [],
      score: match.score,
    }
  }

  const handleChange = (field, value) => {
    setResume((current) => ({ ...current, [field]: value }))
  }

  const handleSave = async () => {
    if (!activeResume) {
      showToast('error', 'No resume found to save.')
      return false
    }

    const resumeId = activeResume.resumeId || activeResume.id

    if (!resumeId) {
      showToast('error', 'Resume ID is missing.')
      return false
    }

    try {
      setSaveStatus('loading')

      await setDoc(
        doc(db, 'resumes', resumeId),
        {
          editedSections: resume,
          editedResumeText,
          hasManualEdits: true,
          analysisStatus: 'needs_reanalysis',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      setSaveStatus('succeeded')
      showToast('success', 'Resume changes saved successfully.')
      return true
    } catch (error) {
      setSaveStatus('failed')
      showToast('error', error.message || 'Failed to save resume changes.')
      return false
    }
  }

  const handleBackToAnalysis = async () => {
    const saved = await handleSave()
    if (!saved) return

    const reanalysisPayload = {
      editedResumeText,
      resume: activeResume,
      reanalyze: true,
    }

    sessionStorage.setItem(
      'resumeReanalysisPayload',
      JSON.stringify(reanalysisPayload)
    )

    dispatch(resetAnalysis())

    navigate('/resume-analysis', { state: reanalysisPayload })
  }

  const handleContinueToSummary = async () => {
    const saved = await handleSave()
    if (!saved) return
    navigate('/feedback-summary')
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator workflowState={workflowState} />

      {message && (
        <div className="fixed right-6 top-6 z-50">
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              message.type === 'success'
                ? 'border-success/30 bg-success/10 text-success'
                : 'border-destructive/30 bg-destructive/10 text-destructive'
            }`}
          >
            <Icon
              name={message.type === 'success' ? 'CheckCircle2' : 'AlertCircle'}
              size={18}
            />
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <header className="mb-10 text-center">
            <p className="mb-3 text-sm font-medium text-primary">
              Manual Resume Editor
            </p>

            <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Refine Your Resume
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Edit your resume content manually, save your changes, then
              re-analyze it to recalibrate your score.
            </p>
          </header>

          {activeResume && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border bg-muted/40 px-5 py-3 text-sm text-muted-foreground">
              <Icon name="FileText" size={16} />
              <span>
                Editing:{' '}
                <span className="font-medium text-foreground">
                  {activeResume.fileName || activeResume.originalFileName}
                </span>
              </span>
            </div>
          )}

          <section className="mb-8 rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">
                  Resume Completion
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Save your changes before re-analyzing.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-2 w-36 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${completionScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {completionScore}%
                </span>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <EditorField
                label="Personal Information"
                value={resume.personalInfo}
                onChange={(value) => handleChange('personalInfo', value)}
                rows={4}
                tips={getTipsForSection('contact')}
              />

              <EditorField
                label="Professional Summary"
                value={resume.summary}
                onChange={(value) => handleChange('summary', value)}
                rows={5}
                tips={getTipsForSection('summary')}
              />

              <EditorField
                label="Work Experience"
                value={resume.experience}
                onChange={(value) => handleChange('experience', value)}
                rows={10}
                tips={getTipsForSection('experience')}
              />

              <EditorField
                label="Education"
                value={resume.education}
                onChange={(value) => handleChange('education', value)}
                rows={5}
                tips={getTipsForSection('education')}
              />

              <EditorField
                label="Skills"
                value={resume.skills}
                onChange={(value) => handleChange('skills', value)}
                rows={4}
                tips={getTipsForSection('skills')}
              />

              <EditorField
                label="Seminars & Certificates"
                value={resume.seminarsAndCertificates}
                onChange={(value) =>
                  handleChange('seminarsAndCertificates', value)
                }
                rows={5}
              />
            </div>

            <aside className="rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-8 lg:self-start">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">
                    Live Preview
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Preview how your updated resume content reads.
                  </p>
                </div>
                <Icon name="FileText" size={24} className="text-primary" />
              </div>

              <div className="space-y-5 rounded-xl bg-background p-5">
                <PreviewSection
                  title="Personal Info"
                  content={resume.personalInfo}
                />
                <PreviewSection title="Summary" content={resume.summary} />
                <PreviewSection title="Experience" content={resume.experience} />
                <PreviewSection title="Education" content={resume.education} />
                <PreviewSection title="Skills" content={resume.skills} />
                <PreviewSection
                  title="Seminars & Certificates"
                  content={resume.seminarsAndCertificates}
                />
              </div>

              <div className="mt-8 flex flex-wrap justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleBackToAnalysis}
                  disabled={saveStatus === 'loading'}
                >
                  <Icon name="ArrowLeft" size={18} />
                  {fromMyResumes ? 'Save & Re-analyze' : 'Back to Analysis'}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={saveStatus === 'loading'}
                >
                  <Icon
                    name={saveStatus === 'loading' ? 'Loader2' : 'Save'}
                    size={18}
                    className={saveStatus === 'loading' ? 'animate-spin' : ''}
                  />
                  {saveStatus === 'loading' ? 'Saving...' : 'Save Changes'}
                </Button>

                {!fromMyResumes && (
                  <Button
                    onClick={handleContinueToSummary}
                    disabled={saveStatus === 'loading'}
                  >
                    Continue to Summary
                    <Icon name="ArrowRight" size={18} />
                  </Button>
                )}
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  )
}

function EditorField({ label, value, onChange, rows = 5, tips = null }) {
  const [showTips, setShowTips] = useState(false)

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-card-foreground">
          {label}
        </span>

        {tips && (
          <button
            type="button"
            onClick={() => setShowTips((prev) => !prev)}
            className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <span>💡</span>
            <span>{showTips ? 'Hide Tips' : 'Show Tips'}</span>
            {tips.score !== undefined && (
              <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-xs">
                {tips.score}%
              </span>
            )}
          </button>
        )}
      </div>

      {tips && showTips && (
        <div className="mb-3 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {tips.feedback}
          </p>

          {tips.suggestions?.length > 0 && (
            <ul className="mt-2 space-y-1">
              {tips.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-xs">
                  <span
                    className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                      suggestion.severity === 'high'
                        ? 'bg-destructive'
                        : suggestion.severity === 'medium'
                          ? 'bg-warning'
                          : 'bg-success'
                    }`}
                  />
                  <span className="text-foreground">{suggestion.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}

function PreviewSection({ title, content }) {
  if (!content || content.trim().length === 0) return null

  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <p className="whitespace-pre-line text-sm leading-7 text-foreground">
        {content}
      </p>
    </section>
  )
}

export default ManualResumeEditorPage