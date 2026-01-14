import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const ProgressIndicator = ({ workflowState = {} }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const steps = [
    { label: 'Upload', path: '/resume-upload', icon: 'Upload' },
    { label: 'Analysis', path: '/resume-analysis', icon: 'FileSearch' },
    { label: 'Edit', path: '/manual-resume-editor', icon: 'Edit' },
    { label: 'Summary', path: '/feedback-summary', icon: 'FileText' }
  ];

  const currentStepIndex = steps?.findIndex(step => step?.path === location?.pathname);
  const completedPhases = workflowState?.completedPhases || [];

  const isStepComplete = (stepPath) => {
    return completedPhases?.includes(stepPath);
  };

  const isStepAccessible = (stepIndex) => {
    if (stepIndex === 0) return true;
    return isStepComplete(steps?.[stepIndex - 1]?.path);
  };

  const handleStepClick = (step, index) => {
    if (index <= currentStepIndex || isStepAccessible(index)) {
      navigate(step?.path);
    }
  };

  return (
    <div className="hidden lg:flex items-center gap-2 px-6 py-4 bg-muted/50 border-b border-border">
      {steps?.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isComplete = isStepComplete(step?.path);
        const isAccessible = isStepAccessible(index);
        const isClickable = index <= currentStepIndex || isAccessible;

        return (
          <React.Fragment key={step?.path}>
            <button
              onClick={() => handleStepClick(step, index)}
              disabled={!isClickable}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-elevation-2' 
                  : isComplete
                  ? 'bg-success/10 text-success hover:bg-success/20'
                  : isClickable
                  ? 'bg-card text-foreground hover:bg-muted'
                  : 'bg-card/50 text-muted-foreground cursor-not-allowed opacity-50'
                }
              `}
            >
              <div className={`
                flex items-center justify-center w-6 h-6 rounded-full
                ${isActive 
                  ? 'bg-primary-foreground/20' 
                  : isComplete
                  ? 'bg-success/20' :'bg-muted'
                }
              `}>
                {isComplete ? (
                  <Icon name="Check" size={14} />
                ) : (
                  <Icon name={step?.icon} size={14} />
                )}
              </div>
              <span className="font-medium text-sm hidden xl:inline">{step?.label}</span>
            </button>
            {index < steps?.length - 1 && (
              <div className={`
                h-0.5 w-8 transition-smooth
                ${isComplete ? 'bg-success' : 'bg-border'}
              `} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressIndicator;