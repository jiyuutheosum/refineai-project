import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const SectionBreakdown = ({ section, findings, recommendations, status }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = () => {
    switch (status) {
      case 'excellent':
        return { icon: 'CheckCircle2', color: 'text-success', bgColor: 'bg-success/10', label: 'Excellent' };
      case 'good':
        return { icon: 'ThumbsUp', color: 'text-primary', bgColor: 'bg-primary/10', label: 'Good' };
      case 'needs-improvement':
        return { icon: 'AlertCircle', color: 'text-warning', bgColor: 'bg-warning/10', label: 'Needs Improvement' };
      default:
        return { icon: 'Info', color: 'text-muted-foreground', bgColor: 'bg-muted', label: 'Not Analyzed' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-smooth hover:shadow-elevation-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-smooth"
      >
        <div className="flex items-center gap-3">
          <div className={`${statusConfig?.bgColor} p-2 rounded-lg`}>
            <Icon name={statusConfig?.icon} size={18} className={`${statusConfig?.color} md:w-5 md:h-5`} />
          </div>
          <div className="text-left">
            <h4 className="text-sm md:text-base font-heading font-semibold text-foreground">{section}</h4>
            <p className={`text-xs md:text-sm ${statusConfig?.color} mt-0.5`}>{statusConfig?.label}</p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
          className="text-muted-foreground flex-shrink-0"
        />
      </button>
      {isExpanded && (
        <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-4 animate-fade-in">
          <div className="pt-4 border-t border-border">
            <h5 className="text-xs md:text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Icon name="FileSearch" size={16} />
              Key Findings
            </h5>
            <ul className="space-y-2">
              {findings?.map((finding, index) => (
                <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                  <Icon name="Dot" size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-border">
            <h5 className="text-xs md:text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Icon name="Lightbulb" size={16} />
              Recommendations
            </h5>
            <ul className="space-y-2">
              {recommendations?.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                  <Icon name="ArrowRight" size={16} className="flex-shrink-0 mt-0.5 text-primary" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionBreakdown;