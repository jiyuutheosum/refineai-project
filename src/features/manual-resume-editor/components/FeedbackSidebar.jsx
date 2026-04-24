import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeedbackSidebar = ({ feedbackItems = [], currentSection = null, onApplySuggestion }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleItem = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded?.has(id)) {
      newExpanded?.delete(id);
    } else {
      newExpanded?.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Impact': 'text-primary bg-primary/10',
      'Clarity': 'text-success bg-success/10',
      'Specificity': 'text-warning bg-warning/10',
      'Relevance': 'text-accent bg-accent/10'
    };
    return colors?.[category] || 'text-muted-foreground bg-muted';
  };

  const filteredFeedback = currentSection 
    ? feedbackItems?.filter(item => item?.section === currentSection)
    : feedbackItems;

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="Lightbulb" size={20} className="text-primary" />
          <h3 className="text-base font-heading font-semibold text-foreground">AI Suggestions</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          {currentSection ? `Showing feedback for ${currentSection}` : 'Select a section to see relevant feedback'}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredFeedback?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Icon name="CheckCircle2" size={24} className="text-success" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Looking Good!</p>
            <p className="text-xs text-muted-foreground">No suggestions for this section</p>
          </div>
        ) : (
          filteredFeedback?.map((item) => (
            <div key={item?.id} className="bg-background border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleItem(item?.id)}
                className="w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-smooth"
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${getCategoryColor(item?.category)}`}>
                  <Icon name={item?.icon} size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">{item?.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item?.reason}</p>
                </div>
                <Icon 
                  name={expandedItems?.has(item?.id) ? 'ChevronUp' : 'ChevronDown'} 
                  size={16} 
                  className="flex-shrink-0 text-muted-foreground"
                />
              </button>

              {expandedItems?.has(item?.id) && (
                <div className="px-3 pb-3 space-y-3 border-t border-border">
                  <div className="pt-3">
                    <p className="text-xs font-medium text-foreground mb-1">Why this matters:</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item?.reason}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Suggestion:</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item?.suggestion}</p>
                  </div>

                  {item?.example && (
                    <div className="p-2 bg-muted/50 rounded-md">
                      <p className="text-xs font-medium text-foreground mb-1">Example:</p>
                      <p className="text-xs text-muted-foreground italic">{item?.example}</p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Check"
                    iconPosition="left"
                    onClick={() => onApplySuggestion(item)}
                    fullWidth
                  >
                    Mark as Applied
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackSidebar;