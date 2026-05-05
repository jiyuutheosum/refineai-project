import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import ProgressIndicator from '@/shared/components/feedback/ProgressIndicator'
import Button from '@/shared/components/ui/Button'
import Icon from '@/shared/components/AppIcon'

const workflowState = {
  completedPhases: ['upload', 'analysis'],
  currentPhase: 'editor',
}

const initialResume = {
  summary:
    'Motivated professional with experience in project coordination, communication, and problem-solving. Skilled at collaborating with cross-functional teams and improving workflows.',
  experience:
    'Project Assistant\nABC Company · 2022 - Present\n- Supported daily project operations and documentation.\n- Coordinated with team members to track deadlines and deliverables.\n- Helped improve reporting workflows and task visibility.',
  skills: 'Project Coordination, Communication, Documentation, Problem Solving',
}

function ManualResumeEditorPage() {
  const [resume, setResume] = useState(initialResume)

  const completionScore = useMemo(() => {
    const fields = Object.values(resume)
    const completedFields = fields.filter((value) => value.trim().length > 0)

    return Math.round((completedFields.length / fields.length) * 100)
  }, [resume])

  const handleChange = (field, value) => {
    setResume((currentResume) => ({
      ...currentResume,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator workflowState={workflowState} />

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
              Edit your resume content manually and review the live preview
              before continuing to the final feedback summary.
            </p>
          </header>

          <section className="mb-8 rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">
                  Resume Completion
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Keep each section clear, specific, and achievement-focused.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-2 w-36 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
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
                label="Professional Summary"
                value={resume.summary}
                onChange={(value) => handleChange('summary', value)}
                rows={6}
              />

              <EditorField
                label="Work Experience"
                value={resume.experience}
                onChange={(value) => handleChange('experience', value)}
                rows={10}
              />

              <EditorField
                label="Skills"
                value={resume.skills}
                onChange={(value) => handleChange('skills', value)}
                rows={4}
              />
            </div>

            <aside className="rounded-2xl border bg-card p-6 shadow-sm">
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

              <div className="space-y-6 rounded-xl bg-background p-5">
                <PreviewSection title="Summary" content={resume.summary} />
                <PreviewSection title="Experience" content={resume.experience} />
                <PreviewSection title="Skills" content={resume.skills} />
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

function EditorField({ label, value, onChange, rows = 5 }) {
  return (
    <label className="block rounded-2xl border bg-card p-5 shadow-sm">
      <span className="mb-3 block text-sm font-semibold text-card-foreground">
        {label}
      </span>

      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
      />
    </label>
  )
}

function PreviewSection({ title, content }) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>

      <p className="whitespace-pre-line text-sm leading-7 text-foreground">
        {content || 'No content added yet.'}
      </p>
    </section>
  )
}

export default ManualResumeEditorPage