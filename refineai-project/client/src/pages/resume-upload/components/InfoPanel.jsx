import React from 'react';
import Icon from '../../../components/AppIcon';

const InfoPanel = () => {
  const features = [
    {
      icon: 'Target',
      title: 'Educational Feedback',
      description: 'Receive guidance on how to improve your resume with explanations for each suggestion'
    },
    {
      icon: 'Lightbulb',
      title: 'Learn as You Go',
      description: 'Understand the reasoning behind recommendations to build better resume-writing skills'
    },
    {
      icon: 'Shield',
      title: 'Privacy First',
      description: 'Your resume is processed securely and temporarily. We do not store personal information permanently'
    },
    {
      icon: 'Zap',
      title: 'Fast Analysis',
      description: 'Get comprehensive feedback in under 10 seconds with real-time processing'
    }
  ];

  const analysisAreas = [
    { icon: 'TrendingUp', label: 'Impact', color: 'text-success' },
    { icon: 'Eye', label: 'Clarity', color: 'text-primary' },
    { icon: 'Target', label: 'Specificity', color: 'text-warning' },
    { icon: 'CheckCircle2', label: 'Relevance', color: 'text-secondary' }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-elevation-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Sparkles" size={20} className="text-primary" />
          </div>
          <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
            How It Works
          </h2>
        </div>

        <div className="space-y-4 md:space-y-5">
          {features?.map((feature, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={feature?.icon} size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-base font-medium text-foreground mb-1">
                  {feature?.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {feature?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-elevation-2">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4 md:mb-6">
          What We Analyze
        </h3>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {analysisAreas?.map((area, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 md:p-4 bg-muted/50 rounded-lg"
            >
              <Icon name={area?.icon} size={18} className={area?.color} />
              <span className="text-sm md:text-base font-medium text-foreground">
                {area?.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 md:p-6">
        <div className="flex gap-3">
          <Icon name="Info" size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm md:text-base font-medium text-foreground mb-2">
              AI-Powered Analysis Disclaimer
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Our AI provides educational suggestions to help you understand how to improve your resume. 
              We focus on teaching you the principles of effective resume writing rather than rewriting 
              your content. Please review all recommendations carefully and use your judgment. You maintain 
              full ownership and control of your resume content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;