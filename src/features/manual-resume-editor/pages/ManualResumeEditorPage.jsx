import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { resetAnalysis } from '@/features/resume-analysis/store/analysisSlice'
import { setCurrentResume } from '@/features/resume-upload/store/resumeUploadSlice'

import ProgressIndicator from '@/shared/components/feedback/ProgressIndicator'
import Button from '@/shared/components/ui/Button'
import Icon from '@/shared/components/AppIcon'
import TemplatePicker from '../components/TemplatePicker'
import { TemplatePreview } from '../components/TemplatePreview'
import RichTextEditor from '../components/RichTextEditor'

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

function toHtml(value) {
  if (!value) return ''
  if (value.trimStart().startsWith('<')) return value
  return value
    .split('\n')
    .map((line) => (line.trim() ? `<p>${line}</p>` : '<p></p>'))
    .join('')
}

function buildResumeText(resume) {
  const strip = (html) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return `
PERSONAL INFORMATION
${strip(resume.personalInfo)}

PROFESSIONAL SUMMARY
${strip(resume.summary)}

WORK EXPERIENCE
${strip(resume.experience)}

EDUCATION
${strip(resume.education)}

SKILLS
${strip(resume.skills)}

SEMINARS & CERTIFICATES
${strip(resume.seminarsAndCertificates)}
  `.trim()
}

function ManualResumeEditorPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  // ── Entry point detection ─────────────────────────────────────────────────
  const fromMyResumes = location.pathname.startsWith('/my-resumes/')
  const fromScratch = location.state?.scratch === true   // from "Choose a Template" on upload page
  const resumeFromState = location.state?.resume ?? null
  const feedbackFromState = location.state?.feedback ?? null

  // ── Redux sources (normal upload → analysis → editor flow) ───────────────
  const { sectionFeedback, extractedSections } = useAppSelector(
    (state) => state.analysis
  )
  const { currentResume } = useAppSelector((state) => state.resumeUpload)
  const user = useAppSelector((state) => state.auth.user)

  // ── Resolve active resume + feedback based on entry point ─────────────────
  // fromScratch: no resume yet — user is building from blank
  // fromMyResumes: resume + feedback passed via location.state
  // normal: currentResume from Redux
  const activeResume = fromScratch ? null : fromMyResumes ? resumeFromState : currentResume
  const activeSectionFeedback = fromMyResumes
    ? feedbackFromState?.sectionFeedback
    : sectionFeedback

  // ── State ─────────────────────────────────────────────────────────────────
  const [resume, setResume] = useState(emptyResume)
  const [selectedTemplate, setSelectedTemplate] = useState(
    location.state?.selectedTemplate ?? 'classic'
  )
  const [resumeName, setResumeName] = useState('Untitled Resume')
  const [saveStatus, setSaveStatus] = useState('idle')
  const [message, setMessage] = useState(null)

  // ── Pre-fill ──────────────────────────────────────────────────────────────
  useEffect(() => {
    // fromScratch: always start empty — never read stale Redux state
    if (fromScratch) {
      setResume(emptyResume)
      return
    }

    if (fromMyResumes) {
      if (!resumeFromState) return
      const sections =
        resumeFromState.editedSections ||
        resumeFromState.extractedSections ||
        null
      if (!sections) return
      setResume({
        personalInfo: toHtml(sections.personalInfo || ''),
        summary: toHtml(sections.summary || ''),
        experience: toHtml(sections.experience || ''),
        education: toHtml(sections.education || ''),
        skills: toHtml(sections.skills || ''),
        seminarsAndCertificates: toHtml(sections.seminarsAndCertificates || ''),
      })
      if (resumeFromState.selectedTemplate) {
        setSelectedTemplate(resumeFromState.selectedTemplate)
      }
      return
    }

    // Normal flow
    if (!extractedSections) return
    setResume({
      personalInfo: toHtml(extractedSections.personalInfo || ''),
      summary: toHtml(extractedSections.summary || ''),
      experience: toHtml(extractedSections.experience || ''),
      education: toHtml(extractedSections.education || ''),
      skills: toHtml(extractedSections.skills || ''),
      seminarsAndCertificates: toHtml(extractedSections.seminarsAndCertificates || ''),
    })
  }, [fromScratch, fromMyResumes, resumeFromState, extractedSections])

  const editedResumeText = useMemo(() => buildResumeText(resume), [resume])

  const completionScore = useMemo(() => {
    const fields = Object.values(resume)
    const filled = fields.filter((html) => {
      const text = html.replace(/<[^>]*>/g, '').trim()
      return text.length > 0
    })
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
    // ========== NEW SCRATCH / TEMPLATE FLOW ==========
    // When building from template, we now create a real resume document in Firestore
    // so it appears in My Resumes and can be analyzed.
    if (fromScratch) {
      const hasContent = Object.values(resume).some(
        (html) => html.replace(/<[^>]*>/g, '').trim().length > 0
      )
      if (!hasContent) {
        showToast('error', 'Please fill in at least one section before saving.')
        return false
      }

      if (!user?.uid) {
        showToast('error', 'You must be logged in to save a resume.')
        return false
      }

      try {
        setSaveStatus('loading')

        // Generate a resumeId (same pattern as file uploads)
        const resumeId = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`

        const finalName = resumeName.trim() || 'Untitled Resume'

        const newResumeData = {
          uid: user.uid,
          resumeId,
          fileName: finalName,
          originalFileName: finalName,
          fileType: 'manual',
          analysisStatus: 'needs_reanalysis',
          editedSections: resume,
          editedResumeText,
          selectedTemplate,
          hasManualEdits: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }

        await setDoc(doc(db, 'resumes', resumeId), newResumeData)

        // Create a resume object in the shape expected by the rest of the app
        const createdResume = {
          resumeId,
          id: resumeId,
          uid: user.uid,
          fileName: finalName,
          originalFileName: finalName,
          fileType: 'manual',
          analysisStatus: 'needs_reanalysis',
        }

        // Make it the current resume in Redux so analysis flow works
        dispatch(setCurrentResume(createdResume))

        setSaveStatus('succeeded')
        showToast('success', 'Resume saved! Proceeding to analysis...')

        // Automatically proceed to analysis (like the normal flow)
        const analysisPayload = {
          editedResumeText,
          resume: createdResume,
          reanalyze: true,
        }

        sessionStorage.setItem('resumeReanalysisPayload', JSON.stringify(analysisPayload))
        dispatch(resetAnalysis())
        navigate('/resume-analysis', { state: analysisPayload })

        return true
      } catch (error) {
        setSaveStatus('failed')
        showToast('error', error.message || 'Failed to save resume.')
        return false
      }
    }
    // ========== END SCRATCH FLOW ==========

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
          selectedTemplate,
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
              {fromScratch ? 'Build Your Resume from Template' : 'Refine Your Resume'}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              {fromScratch
                ? 'Fill in your details below. The live preview updates as you type.'
                : 'Pick a template, edit your content, then re-analyze to recalibrate your score.'}
            </p>
          </header>

          {/* Name input for scratch-created resumes */}
          {fromScratch && (
            <div className="mb-6 flex items-center gap-3">
              <label className="text-sm font-medium text-muted-foreground">Resume Name:</label>
              <input
                type="text"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value || 'Untitled Resume')}
                className="w-full max-w-md rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="My Professional Resume"
              />
            </div>
          )}

          {/* Show file banner only when editing an existing resume */}
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

          {/* fromScratch banner */}
          {fromScratch && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3 text-sm text-primary">
              <Icon name="Edit3" size={16} />
              <span>Building from scratch. Click <strong>Save &amp; Analyze</strong> when ready — your resume will be saved and analyzed automatically.</span>
            </div>
          )}

          {/* Template Picker */}
          <TemplatePicker
            selectedTemplate={selectedTemplate}
            onSelect={setSelectedTemplate}
          />

          {/* Completion bar */}
          <section className="mb-8 rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">
                  Resume Completion
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {fromScratch
                    ? 'Fill in all sections for a complete resume.'
                    : 'Save your changes before re-analyzing.'}
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

          {/* Editor + Live Preview */}
          <section className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <EditorField
                label="Personal Information"
                value={resume.personalInfo}
                onChange={(val) => handleChange('personalInfo', val)}
                placeholder="Full name, phone, email, address, LinkedIn..."
                tips={getTipsForSection('contact')}
              />
              <EditorField
                label="Professional Summary"
                value={resume.summary}
                onChange={(val) => handleChange('summary', val)}
                placeholder="A brief summary of your skills and career goals..."
                tips={getTipsForSection('summary')}
              />
              <EditorField
                label="Work Experience"
                value={resume.experience}
                onChange={(val) => handleChange('experience', val)}
                placeholder="Company, role, dates, responsibilities..."
                minHeight={200}
                tips={getTipsForSection('experience')}
              />
              <EditorField
                label="Education"
                value={resume.education}
                onChange={(val) => handleChange('education', val)}
                placeholder="School, degree, year..."
                tips={getTipsForSection('education')}
              />
              <EditorField
                label="Skills"
                value={resume.skills}
                onChange={(val) => handleChange('skills', val)}
                placeholder="Technical skills, tools, languages..."
                tips={getTipsForSection('skills')}
              />
              <EditorField
                label="Seminars & Certificates"
                value={resume.seminarsAndCertificates}
                onChange={(val) => handleChange('seminarsAndCertificates', val)}
                placeholder="Certifications, training, workshops..."
              />
            </div>

            <aside className="rounded-2xl border bg-card shadow-sm lg:sticky lg:top-8 lg:self-start overflow-hidden">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-card-foreground">
                    Live Preview
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Updates as you type
                  </p>
                </div>
                <Icon name="FileText" size={20} className="text-primary" />
              </div>

              <div className="overflow-auto max-h-[700px]">
                <TemplatePreview templateId={selectedTemplate} resume={resume} />
              </div>

              <div className="border-t px-5 py-4 flex flex-wrap justify-end gap-3">
                {fromScratch ? (
                  // Scratch / Template flow: Save creates a real resume and analyzes it
                  <>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      <Icon name="ArrowLeft" size={18} />
                      Back
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saveStatus === 'loading'}
                    >
                      <Icon
                        name={saveStatus === 'loading' ? 'Loader2' : 'Save'}
                        size={18}
                        className={saveStatus === 'loading' ? 'animate-spin' : ''}
                      />
                      {saveStatus === 'loading' ? 'Saving & Analyzing...' : 'Save & Analyze'}
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  )
}

function EditorField({ label, value, onChange, placeholder, minHeight = 160, tips = null }) {
  const [showTips, setShowTips] = useState(false)

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-card-foreground">{label}</span>

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

      <RichTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        minHeight={minHeight}
      />
    </div>
  )
}

export default ManualResumeEditorPage