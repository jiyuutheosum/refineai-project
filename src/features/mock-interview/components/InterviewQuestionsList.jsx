import { useState } from 'react'
import Icon from '@/shared/components/AppIcon'

/**
 * Reusable component to display a list of mock interview questions.
 * Handles grouping by category + per-question expand/collapse for why + talking points.
 * Used in both the dedicated MockInterviewPage and the ResumeDetailPage.
 */
export default function InterviewQuestionsList({ questions = [] }) {
  const [expandedId, setExpandedId] = useState(null)

  if (!questions || questions.length === 0) {
    return null
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Group questions by category (fallback to 'General')
  const groupedQuestions = questions.reduce((acc, q) => {
    const category = q.category || 'General'
    if (!acc[category]) acc[category] = []
    acc[category].push(q)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
        <div key={category}>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {category}
            </span>
            <span className="text-xs">({categoryQuestions.length})</span>
          </h4>

          <div className="space-y-3">
            {categoryQuestions.map((q, index) => {
              const qId = q.id ?? `${category}-${index}`
              const isExpanded = expandedId === qId

              return (
                <div
                  key={qId}
                  className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm"
                >
                  <button
                    onClick={() => toggleExpand(qId)}
                    className="w-full text-left flex justify-between items-start gap-3 group"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex-1 pr-2">
                      <p className="font-medium text-foreground group-hover:text-primary/90 transition-colors">
                        {q.question}
                      </p>
                    </div>
                    <Icon
                      name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                      size={18}
                      className="text-muted-foreground mt-0.5 flex-shrink-0 transition-transform"
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-4 border-t pt-4 space-y-4 text-sm">
                      {q.why_asked && (
                        <div>
                          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground mb-1.5">
                            WHY THIS QUESTION?
                          </p>
                          <p className="text-foreground leading-relaxed">{q.why_asked}</p>
                        </div>
                      )}

                      {q.suggested_talking_points?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground mb-2">
                            SUGGESTED TALKING POINTS
                          </p>
                          <ul className="space-y-1.5 pl-1">
                            {q.suggested_talking_points.map((point, i) => (
                              <li key={i} className="flex gap-2 text-foreground/90">
                                <span className="text-primary mt-1.5 text-xs">•</span>
                                <span className="leading-snug">{point}</span>
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
  )
}
