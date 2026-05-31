/**
 * TemplatePicker.jsx
 * Top panel in the editor for switching between resume templates.
 */
import { TEMPLATES } from './TemplatePreview'

function TemplatePicker({ selectedTemplate, onSelect }) {
  return (
    <section className="mb-8 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-card-foreground">
          Choose a Template
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Your content updates instantly in the live preview as you switch.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {TEMPLATES.map((template) => {
          const isSelected = selectedTemplate === template.id

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className={`
                relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left
                transition-all duration-150
                ${isSelected
                  ? `${template.accent} bg-primary/5 shadow-sm`
                  : 'border-border bg-background hover:border-muted-foreground/40 hover:bg-muted/40'
                }
              `}
            >
              {/* Mini template thumbnail */}
              <div
                className={`w-full h-14 rounded-md border ${template.preview} overflow-hidden flex flex-col justify-center px-2 gap-1`}
              >
                {template.id === 'classic' && (
                  <>
                    <div className="h-1.5 w-3/4 mx-auto rounded bg-gray-300" />
                    <div className="h-px w-full bg-gray-300 mt-0.5" />
                    <div className="h-1 w-full rounded bg-gray-200" />
                    <div className="h-1 w-5/6 rounded bg-gray-200" />
                  </>
                )}
                {template.id === 'traditional' && (
                  <>
                    <div className="h-1.5 w-1/2 rounded bg-blue-400" />
                    <div className="h-px w-full bg-blue-300 mt-0.5" />
                    <div className="h-1 w-full rounded bg-gray-200" />
                    <div className="h-1 w-4/5 rounded bg-gray-200" />
                  </>
                )}
                {template.id === 'modern' && (
                  <div className="flex gap-1 h-full items-stretch">
                    <div className="w-5 bg-slate-600 rounded-sm flex-shrink-0" />
                    <div className="flex-1 flex flex-col justify-center gap-1">
                      <div className="h-1 w-full rounded bg-slate-300" />
                      <div className="h-1 w-4/5 rounded bg-slate-200" />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-foreground leading-tight">
                  {template.label}
                </p>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>

              {isSelected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default TemplatePicker