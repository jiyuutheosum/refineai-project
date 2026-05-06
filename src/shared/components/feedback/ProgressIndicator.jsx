import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/app/store/hooks'
import Icon from '@/shared/components/AppIcon'

const ProgressIndicator = ({ workflowState = {} }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { overallScore } = useAppSelector((state) => state.analysis)

  const steps = [
    { label: 'Upload', path: '/', icon: 'Upload' },
    { label: 'Analysis', path: '/resume-analysis', icon: 'FileSearch' },
    { label: 'Edit', path: '/manual-resume-editor', icon: 'Edit' },
    { label: 'Summary', path: '/feedback-summary', icon: 'FileText' },
    { label: 'Hirings', path: '/hirings', icon: 'Briefcase', requiresScore: 80 },
  ]

  const currentStepIndex = steps.findIndex(step => step.path === location.pathname)
  const completedPhases = workflowState?.completedPhases || []

  const isStepComplete = (stepPath) => completedPhases.includes(stepPath)

  const isStepAccessible = (step, stepIndex) => {
    if (stepIndex === 0) return true
    // Score gate for Hirings
    if (step.requiresScore && overallScore < step.requiresScore) return false
    return isStepComplete(steps[stepIndex - 1]?.path)
  }

  const handleStepClick = (step, index) => {
    const accessible = isStepAccessible(step, index)
    if (index <= currentStepIndex || accessible) {
      navigate(step.path)
    }
  }

  return (
    <div className="hidden lg:flex items-center gap-2 px-6 py-4 bg-muted/50 border-b border-border">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex
        const isComplete = isStepComplete(step.path)
        const isAccessible = isStepAccessible(step, index)
        const isLocked = step.requiresScore && overallScore < step.requiresScore
        const isClickable = (index <= currentStepIndex || isAccessible) && !isLocked

        return (
          <React.Fragment key={step.path}>
            <div className="relative group">
              <button
                onClick={() => handleStepClick(step, index)}
                disabled={!isClickable}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : isComplete
                    ? 'bg-success/10 text-success hover:bg-success/20'
                    : isLocked
                    ? 'bg-card/50 text-muted-foreground cursor-not-allowed opacity-50'
                    : isClickable
                    ? 'bg-card text-foreground hover:bg-muted'
                    : 'bg-card/50 text-muted-foreground cursor-not-allowed opacity-50'
                  }
                `}
              >
                <div className={`
                  flex items-center justify-center w-6 h-6 rounded-full
                  ${isActive ? 'bg-primary-foreground/20' : isComplete ? 'bg-success/20' : 'bg-muted'}
                `}>
                  {isLocked ? (
                    <Icon name="Lock" size={12} />
                  ) : isComplete ? (
                    <Icon name="Check" size={14} />
                  ) : (
                    <Icon name={step.icon} size={14} />
                  )}
                </div>
                <span className="font-medium text-sm hidden xl:inline">{step.label}</span>
              </button>

              {/* Tooltip for locked Hirings */}
              {isLocked && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                  <div className="bg-popover text-popover-foreground text-xs rounded-lg px-3 py-2 shadow-lg border whitespace-nowrap">
                    🔒 Requires score of {step.requiresScore}+ to unlock
                    <br />
                    <span className="text-muted-foreground">Your score: {overallScore}/100</span>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
                </div>
              )}
            </div>

            {index < steps.length - 1 && (
              <div className={`h-0.5 w-8 transition-all ${isComplete ? 'bg-success' : 'bg-border'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default ProgressIndicator