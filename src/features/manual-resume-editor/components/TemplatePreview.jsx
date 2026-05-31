/**
 * TemplatePreview.jsx
 * Renders resume sections as styled HTML in the chosen template.
 * All content is stored as HTML from Tiptap, rendered via dangerouslySetInnerHTML.
 */

// Shared prose styles for rendering Tiptap HTML inside templates
const proseClass = `
  [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-0.5
  [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-0.5
  [&_strong]:font-semibold
  [&_em]:italic
  [&_u]:underline
  [&_p]:mb-1 [&_p:last-child]:mb-0
  [&_li_p]:mb-0
`

function SectionContent({ html, className = '' }) {
  if (!html) return null
  return (
    <div
      className={`text-[11px] leading-5 ${proseClass} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// ─── Classic Template ─────────────────────────────────────────────────────────
function ClassicTemplate({ resume }) {
  return (
    <div className="bg-white text-gray-900 font-serif text-[11px] leading-relaxed p-6 min-h-[600px]">
      {resume.personalInfo && (
        <div className="text-center mb-4">
          <SectionContent html={resume.personalInfo} className="text-gray-800" />
        </div>
      )}

      {resume.summary && (
        <>
          <hr className="border-gray-400 mb-2" />
          <div className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">
              Professional Summary
            </h2>
            <SectionContent html={resume.summary} className="text-gray-800" />
          </div>
        </>
      )}

      {resume.experience && (
        <>
          <hr className="border-gray-400 mb-2" />
          <div className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">
              Work Experience
            </h2>
            <SectionContent html={resume.experience} className="text-gray-800" />
          </div>
        </>
      )}

      {resume.education && (
        <>
          <hr className="border-gray-400 mb-2" />
          <div className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">
              Education
            </h2>
            <SectionContent html={resume.education} className="text-gray-800" />
          </div>
        </>
      )}

      {resume.skills && (
        <>
          <hr className="border-gray-400 mb-2" />
          <div className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">
              Skills
            </h2>
            <SectionContent html={resume.skills} className="text-gray-800" />
          </div>
        </>
      )}

      {resume.seminarsAndCertificates && (
        <>
          <hr className="border-gray-400 mb-2" />
          <div className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">
              Seminars & Certificates
            </h2>
            <SectionContent html={resume.seminarsAndCertificates} className="text-gray-800" />
          </div>
        </>
      )}
    </div>
  )
}

// ─── Traditional Template ─────────────────────────────────────────────────────
function TraditionalTemplate({ resume }) {
  return (
    <div className="bg-white text-gray-900 font-sans text-[11px] leading-relaxed p-6 min-h-[600px]">
      {resume.personalInfo && (
        <div className="mb-4 pb-3 border-b-2 border-blue-700">
          <SectionContent html={resume.personalInfo} className="text-gray-800" />
        </div>
      )}

      {resume.summary && (
        <div className="mb-3">
          <h2 className="text-[10px] font-bold uppercase text-blue-700 border-b border-blue-200 pb-0.5 mb-1 tracking-wide">
            Objective / Summary
          </h2>
          <SectionContent html={resume.summary} className="text-gray-800" />
        </div>
      )}

      {resume.experience && (
        <div className="mb-3">
          <h2 className="text-[10px] font-bold uppercase text-blue-700 border-b border-blue-200 pb-0.5 mb-1 tracking-wide">
            Professional Experience
          </h2>
          <SectionContent html={resume.experience} className="text-gray-800" />
        </div>
      )}

      {resume.education && (
        <div className="mb-3">
          <h2 className="text-[10px] font-bold uppercase text-blue-700 border-b border-blue-200 pb-0.5 mb-1 tracking-wide">
            Education
          </h2>
          <SectionContent html={resume.education} className="text-gray-800" />
        </div>
      )}

      {resume.skills && (
        <div className="mb-3">
          <h2 className="text-[10px] font-bold uppercase text-blue-700 border-b border-blue-200 pb-0.5 mb-1 tracking-wide">
            Skills
          </h2>
          <SectionContent html={resume.skills} className="text-gray-800" />
        </div>
      )}

      {resume.seminarsAndCertificates && (
        <div className="mb-3">
          <h2 className="text-[10px] font-bold uppercase text-blue-700 border-b border-blue-200 pb-0.5 mb-1 tracking-wide">
            Certifications & Seminars
          </h2>
          <SectionContent html={resume.seminarsAndCertificates} className="text-gray-800" />
        </div>
      )}
    </div>
  )
}

// ─── Modern Professional Template ────────────────────────────────────────────
function ModernProfessionalTemplate({ resume }) {
  return (
    <div className="bg-white text-gray-900 font-sans text-[11px] leading-relaxed flex min-h-[600px]">
      {/* Left sidebar */}
      <div className="w-[38%] bg-slate-800 text-slate-100 p-4 flex-shrink-0">
        {resume.personalInfo && (
          <div className="mb-5">
            <SectionContent html={resume.personalInfo} className="text-slate-200" />
          </div>
        )}

        {resume.skills && (
          <div className="mb-4">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Skills
            </h2>
            <SectionContent html={resume.skills} className="text-slate-200" />
          </div>
        )}

        {resume.seminarsAndCertificates && (
          <div className="mb-4">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Certifications
            </h2>
            <SectionContent html={resume.seminarsAndCertificates} className="text-slate-200" />
          </div>
        )}
      </div>

      {/* Right main content */}
      <div className="flex-1 p-4">
        {resume.summary && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1">
              <span className="inline-block w-3 h-0.5 bg-slate-400" />
              Profile
            </h2>
            <SectionContent html={resume.summary} className="text-gray-700" />
          </div>
        )}

        {resume.experience && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1">
              <span className="inline-block w-3 h-0.5 bg-slate-400" />
              Experience
            </h2>
            <SectionContent html={resume.experience} className="text-gray-700" />
          </div>
        )}

        {resume.education && (
          <div className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1">
              <span className="inline-block w-3 h-0.5 bg-slate-400" />
              Education
            </h2>
            <SectionContent html={resume.education} className="text-gray-700" />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Exports ──────────────────────────────────────────────────────────────────
export const TEMPLATES = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Clean & timeless',
    accent: 'border-gray-400',
    preview: 'bg-gray-50',
  },
  {
    id: 'traditional',
    label: 'Traditional',
    description: 'Bold & structured',
    accent: 'border-blue-600',
    preview: 'bg-blue-50',
  },
  {
    id: 'modern',
    label: 'Modern Professional',
    description: 'Two-column sidebar',
    accent: 'border-slate-700',
    preview: 'bg-slate-100',
  },
]

export function TemplatePreview({ templateId, resume }) {
  if (templateId === 'traditional') return <TraditionalTemplate resume={resume} />
  if (templateId === 'modern') return <ModernProfessionalTemplate resume={resume} />
  return <ClassicTemplate resume={resume} />
}