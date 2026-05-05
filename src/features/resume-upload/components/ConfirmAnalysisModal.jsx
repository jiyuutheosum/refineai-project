import React from 'react';
import Icon from '@/shared/components/AppIcon';
import Button from '@/shared/components/ui/Button';

const ConfirmAnalysisModal = ({ 
  isOpen, 
  fileName, 
  fileSize, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-elevation-5 p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Icon name="FileSearch" size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Analyze Resume
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Would you like to analyze "{fileName}" for AI-powered feedback?
        </p>

        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-3">
            <Icon name="FileText" size={18} className="text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {fileName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(fileSize)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground mb-4">
          <Icon name="Info" size={14} className="flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            The analysis will provide educational feedback on your resume's 
            strengths and areas for improvement.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="default"
            iconName="Search"
            iconPosition="left"
            onClick={onConfirm}
            fullWidth
          >
            Analyze
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAnalysisModal;
