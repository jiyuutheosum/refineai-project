import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@/shared/components/AppIcon';
import Button from '@/shared/components/ui/Button';

const HelpContext = ({ helpContent = {} }) => {
  const {
    title = 'Need Help?',
    description = 'Get contextual guidance for this screen',
    sections = [],
    aiDisclaimer = true,
  } = helpContent;

  const defaultSections = [
    {
      title: 'Getting Started',
      icon: 'Lightbulb',
      content:
        'Upload your resume to receive AI-powered feedback and suggestions for improvement.',
    },
    {
      title: 'Understanding Feedback',
      icon: 'MessageSquare',
      content:
        'Our AI analyzes your resume for impact, clarity, specificity, and relevance to help you create a stronger application.',
    },
    {
      title: 'Privacy & Security',
      icon: 'Shield',
      content:
        'Your resume is processed securely and temporarily. We do not store your personal information permanently.',
    },
  ];

  const displaySections = sections?.length > 0 ? sections : defaultSections;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="fixed bottom-6 right-6 z-[150] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevation-4 transition-smooth hover:scale-105 hover-lift"
          aria-label="Open help"
        >
          <Icon name="HelpCircle" size={24} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm animate-fade-in" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-[201] w-full max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 p-4">
          <div className="relative w-full max-h-[90vh] overflow-hidden rounded-2xl bg-card shadow-elevation-5 animate-fade-in">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon name="HelpCircle" size={20} className="text-primary" />
                </div>

                <div>
                  <Dialog.Title className="font-heading text-lg font-semibold text-foreground">
                    {title}
                  </Dialog.Title>

                  <Dialog.Description className="text-sm text-muted-foreground">
                    {description}
                  </Dialog.Description>
                </div>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-lg p-2 transition-smooth hover:bg-muted"
                  aria-label="Close help"
                >
                  <Icon name="X" size={20} />
                </button>
              </Dialog.Close>
            </div>

            <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
              <div className="space-y-6">
                {displaySections.map((section, index) => (
                  <div key={`${section?.title}-${index}`} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon
                        name={section?.icon}
                        size={20}
                        className="text-primary"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
                        {section?.title}
                      </h3>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {section?.content}
                      </p>

                      {section?.tips && (
                        <ul className="mt-3 space-y-2">
                          {section.tips.map((tip, tipIndex) => (
                            <li
                              key={`${tip}-${tipIndex}`}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <Icon
                                name="Check"
                                size={16}
                                className="mt-0.5 flex-shrink-0 text-success"
                              />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}

                {aiDisclaimer && (
                  <div className="mt-8 rounded-lg border border-warning/20 bg-warning/10 p-4">
                    <div className="flex gap-3">
                      <Icon
                        name="AlertTriangle"
                        size={20}
                        className="mt-0.5 flex-shrink-0 text-warning"
                      />

                      <div>
                        <h4 className="mb-1 text-sm font-medium text-foreground">
                          AI-Powered Analysis
                        </h4>

                        <p className="text-xs leading-relaxed text-muted-foreground">
                          Our AI provides suggestions to improve your resume.
                          While we strive for accuracy, please review all
                          recommendations carefully and use your judgment. The
                          final content decisions are yours, and you maintain
                          full ownership of your resume.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Mail" size={16} />
                    <span>Need more help? Contact support</span>
                  </div>

                  <Dialog.Close asChild>
                    <Button variant="outline" size="sm">
                      Close
                    </Button>
                  </Dialog.Close>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default HelpContext;