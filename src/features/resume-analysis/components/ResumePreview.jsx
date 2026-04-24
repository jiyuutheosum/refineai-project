import React from 'react';
import Icon from '../../../components/AppIcon';

const ResumePreview = ({ resumeContent, highlightedLines, onLineClick }) => {
  const categoryColors = {
    impact: 'bg-primary/20 border-l-4 border-primary',
    clarity: 'bg-secondary/20 border-l-4 border-secondary',
    specificity: 'bg-warning/20 border-l-4 border-warning',
    relevance: 'bg-accent/20 border-l-4 border-accent'
  };

  const renderLine = (line, index) => {
    const lineNumber = index + 1;
    const highlight = highlightedLines?.find(h => h?.lineNumber === lineNumber);
    const isHighlighted = !!highlight;

    return (
      <div
        key={index}
        onClick={() => isHighlighted && onLineClick(lineNumber)}
        className={`
          px-3 md:px-4 py-2 md:py-2.5 transition-smooth
          ${isHighlighted 
            ? `${categoryColors?.[highlight?.category]} cursor-pointer hover:opacity-80` 
            : 'hover:bg-muted/30'
          }
        `}
      >
        <div className="flex items-start gap-2 md:gap-3">
          <span className="text-xs text-muted-foreground font-mono flex-shrink-0 mt-0.5">
            {String(lineNumber)?.padStart(2, '0')}
          </span>
          <p className="text-xs md:text-sm text-foreground leading-relaxed flex-1">
            {line}
          </p>
          {isHighlighted && (
            <Icon 
              name="MessageSquare" 
              size={14} 
              className="text-muted-foreground flex-shrink-0 mt-0.5"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-5 lg:px-6 py-3 md:py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 md:gap-3">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-sm md:text-base font-heading font-semibold text-foreground">
            Resume Preview
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden md:inline">
            {resumeContent?.length} lines
          </span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span className="text-xs text-muted-foreground">Parsed</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border/50">
          {resumeContent?.map((line, index) => renderLine(line, index))}
        </div>
      </div>
      <div className="px-4 md:px-5 lg:px-6 py-3 md:py-4 border-t border-border bg-muted/30">
        <div className="flex items-center gap-4 md:gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/20 border-l-2 border-primary"></div>
            <span className="text-muted-foreground">Impact</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary/20 border-l-2 border-secondary"></div>
            <span className="text-muted-foreground">Clarity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning/20 border-l-2 border-warning"></div>
            <span className="text-muted-foreground">Specificity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent/20 border-l-2 border-accent"></div>
            <span className="text-muted-foreground">Relevance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;