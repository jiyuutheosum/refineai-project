import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComparisonView = ({ originalContent, editedContent, onClose }) => {
  const sections = ['Education', 'Skills', 'Experience', 'Projects', 'Certifications'];

  const getContentForSection = (content, section) => {
    const sectionData = content?.find(item => item?.section === section);
    return sectionData ? sectionData?.content : 'No content available';
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/95 animate-fade-in">
      <div className="w-full max-w-6xl max-h-[90vh] bg-card rounded-2xl shadow-elevation-5 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
              <Icon name="GitCompare" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground">Compare Versions</h2>
              <p className="text-sm text-muted-foreground">Review your changes side by side</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="w-8 h-8 p-0"
          />
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="FileText" size={18} className="text-muted-foreground" />
                <h3 className="text-base font-heading font-semibold text-foreground">Original</h3>
              </div>
              <div className="space-y-6">
                {sections?.map((section) => (
                  <div key={`original-${section}`}>
                    <h4 className="text-sm font-medium text-foreground mb-2">{section}</h4>
                    <div className="p-3 bg-muted/30 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {getContentForSection(originalContent, section)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="FileEdit" size={18} className="text-success" />
                <h3 className="text-base font-heading font-semibold text-foreground">Edited</h3>
              </div>
              <div className="space-y-6">
                {sections?.map((section) => (
                  <div key={`edited-${section}`}>
                    <h4 className="text-sm font-medium text-foreground mb-2">{section}</h4>
                    <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {getContentForSection(editedContent, section)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close Comparison
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;