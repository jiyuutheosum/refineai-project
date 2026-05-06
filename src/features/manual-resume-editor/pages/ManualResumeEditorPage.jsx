import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/store/hooks'

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

function ManualResumeEditorPage() {
  const { sectionFeedback, extractedSections } = useAppSelector((state) => state.analysis)
  const { currentResume } = useAppSelector((state) => state.resumeUpload)
  const [resume, setResume] = useState(emptyResume)

  // Pre-fill with real extracted resume content
  useEffect(() => {
    if (!extractedSections) return
    setResume({
      personalInfo: extractedSections.personalInfo || '',
      summary: extractedSections.summary || '',
      experience: extractedSections.experience || '',
      education: extractedSections.education || '',
      skills: extractedSections.skills || '',
      seminarsAndCertificates: extractedSections.seminarsAndCertificates || '',
    })
  }, [extractedSections])

  // Get improvement tips per section from Groq analysis
  const getTipsForSection = (sectionName) => {
    if (!sectionFeedback || sectionFeedback.length === 0) return null
    const match = sectionFeedback.find((s) =>
      s.section?.toLowerCase().includes(sectionName.toLowerCase())
    )
    if (!match) return null
    return {
      feedback: match.feedback,
      suggestions: match.suggestions || [],
      score: match.score,
    }
  }

  const completionScore = useMemo(() => {
    const fields = Object.values(resume)
    const filled = fields.filter((v) => v.trim().length > 0)
    return Math.round((filled.length / fields.length) * 100)
  }, [resume])

  const handleChange = (field, value) => {
    setResume((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator workflowState={workflowState} />

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <header className="mb-10 text-center">
            <p className="mb-3 text-sm font-medium text-primary">Manual Resume Editor</p>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Refine Your Resume
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Edit your resume content manually and review the live preview before continuing to the final feedback summary.
            </p>
          </header>

          {currentResume && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border bg-muted/40 px-5 py-3 text-sm text-muted-foreground">
              <Icon name="FileText" size={16} />
              <span>Editing: <span className="font-medium text-foreground">{currentResume.fileName}</span></span>
            </div>
          )}

          <section className="mb-8 rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">Resume Completion</h2>
                <p className="mt-1 text-sm text-muted-foreground">Keep each section clear, specific, and achievement-focused.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-36 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${completionScore}%` }} />
                </div>
                <span className="text-sm font-medium text-foreground">{completionScore}%</span>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <EditorField
                label="Personal Information"
                placeholder="Full name, email, phone, address, LinkedIn, portfolio..."
                value={resume.personalInfo}
                onChange={(value) => handleChange('personalInfo', value)}
                rows={4}
                tips={getTipsForSection('contact')}
              />
              <EditorField
                label="Professional Summary"
                placeholder="Write a 2-3 sentence summary of your professional background and goals..."
                value={resume.summary}
                onChange={(value) => handleChange('summary', value)}
                rows={5}
                tips={getTipsForSection('summary')}
              />
              <EditorField
                label="Work Experience"
                placeholder="Job Title&#10;Company · Year - Year&#10;- Achievement or responsibility"
                value={resume.experience}
                onChange={(value) => handleChange('experience', value)}
                rows={10}
                tips={getTipsForSection('experience')}
              />
              <EditorField
                label="Education"
                placeholder="Degree / Course&#10;School Name · Year - Year"
                value={resume.education}
                onChange={(value) => handleChange('education', value)}
                rows={5}
                tips={getTipsForSection('education')}
              />
              <EditorField
                label="Skills"
                placeholder="List your technical and soft skills separated by commas..."
                value={resume.skills}
                onChange={(value) => handleChange('skills', value)}
                rows={4}
                tips={getTipsForSection('skills')}
              />
              <EditorField
                label="Seminars & Certificates"
                placeholder="Certificate Name · Issuer · Year&#10;Seminar Name · Organizer · Year"
                value={resume.seminarsAndCertificates}
                onChange={(value) => handleChange('seminarsAndCertificates', value)}
                rows={5}
                tips={null}
              />
            </div>

            {/* Live preview */}
            <aside className="rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-8 lg:self-start">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">Live Preview</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Preview how your updated resume content reads.</p>
                </div>
                <Icon name="FileText" size={24} className="text-primary" />
              </div>

              <div className="space-y-5 rounded-xl bg-background p-5">
                <PreviewSection title="Personal Info" content={resume.personalInfo} />
                <PreviewSection title="Summary" content={resume.summary} />
                <PreviewSection title="Experience" content={resume.experience} />
                <PreviewSection title="Education" content={resume.education} />
                <PreviewSection title="Skills" content={resume.skills} />
                <PreviewSection title="Seminars & Certificates" content={resume.seminarsAndCertificates} />
              </div>

              <div className="mt-8 flex flex-wrap justify-end gap-3">
                <Button variant="outline" asChild>
                  <Link to="/resume-analysis">
                    <Icon name="ArrowLeft" size={18} />
                    Back to Analysis
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/feedback-summary">
                    Continue to Summary
                    <Icon name="ArrowRight" size={18} />
                  </Link>
                </Button>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  )
}

function EditorField({ label, value, onChange, rows = 5, placeholder = '', tips = null }) {
  const [showTips, setShowTips] = useState(false)

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-card-foreground">{label}</span>

        {/* Show tip toggle if tips exist */}
        {tips && (
          <button
            type="button"
            onClick={() => setShowTips((prev) => !prev)}
            className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
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

      {/* Tips panel */}
      {tips && showTips && (
        <div className="mb-3 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <p className="text-xs text-muted-foreground leading-relaxed">{tips.feedback}</p>
          {tips.suggestions && tips.suggestions.length > 0 && (
            <ul className="space-y-1 mt-2">
              {tips.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className={`mt-0.5 flex-shrink-0 rounded-full w-2 h-2 ${
                    s.severity === 'high' ? 'bg-destructive' :
                    s.severity === 'medium' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <span className="text-foreground">{s.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
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
      <p className="whitespace-pre-line text-sm leading-7 text-foreground">{content}</p>
    </section>
  )
}

export default ManualResumeEditorPage