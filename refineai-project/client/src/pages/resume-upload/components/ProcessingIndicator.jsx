import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcessingIndicator = ({ fileName, progress }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-elevation-2">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
          <Icon name="Loader2" size={24} className="text-primary animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1">
            Processing Your Resume
          </h3>
          <p className="text-sm md:text-base text-muted-foreground truncate">
            {fileName}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Processing...</span>
          <span className="font-medium text-primary">{progress}%</span>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Estimated time: Less than 10 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessingIndicator;