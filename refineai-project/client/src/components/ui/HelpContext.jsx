import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const HelpContext = ({ helpContent = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    title = 'Need Help?',
    description = 'Get contextual guidance for this screen',
    sections = [],
    aiDisclaimer = true
  } = helpContent;

  const defaultSections = [
    {
      title: 'Getting Started',
      icon: 'Lightbulb',
      content: 'Upload your resume to receive AI-powered feedback and suggestions for improvement.'
    },
    {
      title: 'Understanding Feedback',
      icon: 'MessageSquare',
      content: 'Our AI analyzes your resume for impact, clarity, specificity, and relevance to help you create a stronger application.'
    },
    {
      title: 'Privacy & Security',
      icon: 'Shield',
      content: 'Your resume is processed securely and temporarily. We do not store your personal information permanently.'
    }
  ];

  const displaySections = sections?.length > 0 ? sections : defaultSections;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[150] flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-elevation-4 hover:scale-105 transition-smooth hover-lift"
        aria-label="Open help"
      >
        <Icon name="HelpCircle" size={24} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-background"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] bg-card rounded-2xl shadow-elevation-5 overflow-hidden animate-fade-in">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Icon name="HelpCircle" size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-semibold text-foreground">{title}</h2>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
                aria-label="Close help"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              <div className="space-y-6">
                {displaySections?.map((section, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={section?.icon} size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-heading font-semibold text-foreground mb-2">
                        {section?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {section?.content}
                      </p>
                      {section?.tips && (
                        <ul className="mt-3 space-y-2">
                          {section?.tips?.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}

                {aiDisclaimer && (
                  <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex gap-3">
                      <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-1">AI-Powered Analysis</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Our AI provides suggestions to improve your resume. While we strive for accuracy, 
                          please review all recommendations carefully and use your judgment. The final content 
                          decisions are yours, and you maintain full ownership of your resume.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Mail" size={16} />
                    <span>Need more help? Contact support</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpContext;