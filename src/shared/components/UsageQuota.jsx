import { useEffect, useState } from 'react'
import Icon from '@/shared/components/AppIcon'
import { aiApi } from '@/lib/backendApi'

/**
 * UsageQuota - Displays current AI usage remaining for the signed-in user.
 * Shows remaining counts for resume analyses and mock interviews (free tier defaults).
 * Drop-in component; fetches its own data on mount (fail-silent).
 *
 * Usage:
 *   <UsageQuota compact />
 *   <UsageQuota className="mt-2" onData={(data) => ...} />
 */
export default function UsageQuota({ compact = false, className = '', onData }) {
  const [usage, setUsage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    aiApi
      .getUsage()
      .then((data) => {
        if (!cancelled) {
          setUsage(data)
          if (onData) onData(data)
        }
      })
      .catch(() => {
        if (!cancelled) setUsage(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [onData])

  if (loading) {
    return (
      <div className={`inline-flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <Icon name="Loader2" size={12} className="animate-spin" />
        Loading quota...
      </div>
    )
  }

  if (!usage || !usage.remaining) {
    return null // silent fail — not critical UI
  }

  const rem = usage.remaining
  const lowAnalysis = rem.resumeAnalysis <= 2
  const lowMock = rem.mockInterview <= 1

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-[11px] text-muted-foreground shadow-sm ${className}`}
        title={`Resets daily. Used today: ${usage.usage?.resumeAnalysis || 0} analyses, ${usage.usage?.mockInterview || 0} mocks`}
      >
        <Icon name="Zap" size={13} className="text-primary" />
        <span>
          <span className={lowAnalysis ? 'text-warning font-medium' : 'text-foreground font-medium'}>
            {rem.resumeAnalysis}
          </span>
          {' '}analysis
        </span>
        <span className="text-muted-foreground/60">•</span>
        <span>
          <span className={lowMock ? 'text-warning font-medium' : 'text-foreground font-medium'}>
            {rem.mockInterview}
          </span>
          {' '}mocks left
        </span>
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl border bg-card p-3 text-sm shadow-sm ${className}`}
      title="Daily free tier limits reset at midnight UTC"
    >
      <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon name="Zap" size={14} className="text-primary" />
        AI Quota Today (remaining)
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <div>
          <span className={`font-semibold tabular-nums ${lowAnalysis ? 'text-warning' : 'text-foreground'}`}>
            {rem.resumeAnalysis}
          </span>
          <span className="text-muted-foreground"> / {usage.limits?.resumeAnalysis || 20} analyses</span>
        </div>
        <div>
          <span className={`font-semibold tabular-nums ${lowMock ? 'text-warning' : 'text-foreground'}`}>
            {rem.mockInterview}
          </span>
          <span className="text-muted-foreground"> / {usage.limits?.mockInterview || 5} mock interviews</span>
        </div>
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground/70">
        Resets daily at midnight UTC
      </div>
    </div>
  )
}
