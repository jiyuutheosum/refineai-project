import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';

const ExportOptions = ({ onExport }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handlePDFExport = async () => {
    setIsExporting(true);
    setTimeout(() => {
      if (onExport) onExport('pdf');
      setIsExporting(false);
    }, 1500);
  };

  const handleEmailSend = async () => {
    if (!email) return;
    setIsExporting(true);
    setTimeout(() => {
      if (onExport) onExport('email', email);
      setIsExporting(false);
      setShowEmailModal(false);
      setEmail('');
    }, 1500);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Icon name="Download" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
              Export Summary
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Save your feedback for future reference
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            iconName="FileText"
            iconPosition="left"
            loading={isExporting}
            onClick={handlePDFExport}
            fullWidth
          >
            Download PDF
          </Button>

          <Button
            variant="outline"
            iconName="Mail"
            iconPosition="left"
            onClick={() => setShowEmailModal(true)}
            fullWidth
          >
            Email Summary
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Icon name="Info" size={14} className="flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Your exported summary includes overall scores, detailed feedback, and recommended actions. 
              No personal data is stored permanently.
            </p>
          </div>
        </div>
      </div>
      {showEmailModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowEmailModal(false)}
          />

          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-elevation-5 p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Email Summary
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Enter your email address to receive a detailed summary of your resume feedback.
            </p>

            <Input
              type="email"
              label="Email Address"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              required
              className="mb-4"
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowEmailModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="default"
                iconName="Send"
                iconPosition="left"
                loading={isExporting}
                onClick={handleEmailSend}
                disabled={!email}
                fullWidth
              >
                Send Email
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportOptions;