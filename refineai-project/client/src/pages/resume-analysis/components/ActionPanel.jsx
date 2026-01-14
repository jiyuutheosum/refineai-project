import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionPanel = ({ feedbackCount, onDownload }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elevation-4 lg:relative lg:border-0 lg:shadow-none lg:bg-transparent">
      <div className="px-4 md:px-6 lg:px-0 py-4 md:py-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
          <div className="flex-1 bg-primary/10 rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Sparkles" size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-foreground mb-0.5">
                  Analysis Complete
                </p>
                <p className="text-xs text-muted-foreground">
                  {feedbackCount} improvement suggestions ready
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 md:gap-3">
            <Button
              variant="outline"
              size="default"
              iconName="Download"
              iconPosition="left"
              onClick={onDownload}
              className="flex-1 md:flex-none"
            >
              <span className="hidden md:inline">Download</span>
              <span className="md:hidden">Export</span>
            </Button>

            <Button
              variant="default"
              size="default"
              iconName="Edit"
              iconPosition="left"
              onClick={() => navigate('/manual-resume-editor')}
              className="flex-1 md:flex-none"
            >
              Edit Resume
            </Button>
          </div>
        </div>

        <div className="mt-3 md:mt-4 flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <Icon name="AlertTriangle" size={16} className="text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground font-medium mb-1">
              Educational Guidance
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              These suggestions are meant to help you learn and improve. Review each carefully and apply what makes sense for your unique experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;