import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FeedbackCard = ({ feedback, onHighlight }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryConfig = {
    impact: {
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      icon: 'Zap'
    },
    clarity: {
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      icon: 'Eye'
    },
    specificity: {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      icon: 'Target'
    },
    relevance: {
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
      icon: 'CheckCircle2'
    }
  };

  const config = categoryConfig?.[feedback?.category?.toLowerCase()] || categoryConfig?.impact;

  return (
    <div className={`border ${config?.borderColor} rounded-lg overflow-hidden transition-smooth hover:shadow-elevation-2`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 md:p-5 lg:p-6 flex items-start gap-3 md:gap-4 hover:bg-muted/50 transition-smooth text-left"
      >
        <div className={`${config?.bgColor} p-2 md:p-2.5 rounded-lg flex-shrink-0`}>
          <Icon name={config?.icon} size={20} className={config?.color} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 md:mb-2">
            <span className={`text-xs md:text-sm font-medium ${config?.color}`}>
              {feedback?.category}
            </span>
            <span className="text-xs text-muted-foreground">
              Line {feedback?.lineNumber}
            </span>
          </div>
          
          <p className="text-sm md:text-base text-foreground font-medium mb-1 md:mb-2 line-clamp-2">
            {feedback?.title}
          </p>
          
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
            {feedback?.reason}
          </p>
        </div>

        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
          className="text-muted-foreground flex-shrink-0 mt-1"
        />
      </button>
      {isExpanded && (
        <div className="px-4 md:px-5 lg:px-6 pb-4 md:pb-5 lg:pb-6 border-t border-border animate-fade-in">
          <div className="space-y-4 md:space-y-5 pt-4 md:pt-5">
            <div>
              <h4 className="text-xs md:text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                Why This Matters
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {feedback?.reason}
              </p>
            </div>

            <div>
              <h4 className="text-xs md:text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Icon name="Lightbulb" size={16} />
                Suggestion
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {feedback?.suggestion}
              </p>
            </div>

            {feedback?.example && (
              <div className={`${config?.bgColor} p-3 md:p-4 rounded-lg`}>
                <h4 className="text-xs md:text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Icon name="FileText" size={16} />
                  Example Improvement
                </h4>
                <p className="text-xs md:text-sm text-foreground leading-relaxed">
                  {feedback?.example}
                </p>
              </div>
            )}

            <button
              onClick={() => onHighlight(feedback?.lineNumber)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 md:py-2.5 ${config?.bgColor} ${config?.color} rounded-lg hover:opacity-80 transition-smooth text-xs md:text-sm font-medium`}
            >
              <Icon name="MapPin" size={16} />
              Highlight in Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;