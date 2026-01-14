import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import FeedbackCard from './FeedbackCard';

const FeedbackPanel = ({ feedbackData, onHighlight }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');

  const categories = [
    { value: 'all', label: 'All Feedback', icon: 'List' },
    { value: 'impact', label: 'Impact', icon: 'Zap' },
    { value: 'clarity', label: 'Clarity', icon: 'Eye' },
    { value: 'specificity', label: 'Specificity', icon: 'Target' },
    { value: 'relevance', label: 'Relevance', icon: 'CheckCircle2' }
  ];

  const sections = [
    { value: 'all', label: 'All Sections' },
    { value: 'education', label: 'Education' },
    { value: 'skills', label: 'Skills' },
    { value: 'experience', label: 'Experience' },
    { value: 'projects', label: 'Projects' },
    { value: 'certifications', label: 'Certifications' }
  ];

  const filteredFeedback = feedbackData?.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item?.category?.toLowerCase() === selectedCategory;
    const sectionMatch = selectedSection === 'all' || item?.section?.toLowerCase() === selectedSection;
    return categoryMatch && sectionMatch;
  });

  const feedbackStats = {
    total: feedbackData?.length,
    impact: feedbackData?.filter(f => f?.category?.toLowerCase() === 'impact')?.length,
    clarity: feedbackData?.filter(f => f?.category?.toLowerCase() === 'clarity')?.length,
    specificity: feedbackData?.filter(f => f?.category?.toLowerCase() === 'specificity')?.length,
    relevance: feedbackData?.filter(f => f?.category?.toLowerCase() === 'relevance')?.length
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-4 md:px-5 lg:px-6 py-3 md:py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Icon name="MessageSquare" size={20} className="text-primary" />
            <h3 className="text-sm md:text-base font-heading font-semibold text-foreground">
              AI Feedback
            </h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
            <Icon name="Sparkles" size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">
              {filteredFeedback?.length} suggestions
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 md:mb-4">
          {[
            { label: 'Impact', count: feedbackStats?.impact, color: 'text-primary' },
            { label: 'Clarity', count: feedbackStats?.clarity, color: 'text-secondary' },
            { label: 'Specificity', count: feedbackStats?.specificity, color: 'text-warning' },
            { label: 'Relevance', count: feedbackStats?.relevance, color: 'text-accent' }
          ]?.map((stat) => (
            <div key={stat?.label} className="bg-muted/50 rounded-lg p-2 md:p-3">
              <p className="text-xs text-muted-foreground mb-0.5">{stat?.label}</p>
              <p className={`text-lg md:text-xl font-semibold ${stat?.color}`}>
                {stat?.count}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-2 pb-2 md:pb-0">
              {categories?.map((cat) => (
                <button
                  key={cat?.value}
                  onClick={() => setSelectedCategory(cat?.value)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-smooth flex-shrink-0
                    text-xs md:text-sm font-medium whitespace-nowrap
                    ${selectedCategory === cat?.value
                      ? 'bg-primary text-primary-foreground shadow-elevation-1'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  <Icon name={cat?.icon} size={14} />
                  <span className="hidden md:inline">{cat?.label}</span>
                </button>
              ))}
            </div>
          </div>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e?.target?.value)}
            className="px-3 py-2 bg-muted border border-border rounded-lg text-xs md:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sections?.map((section) => (
              <option key={section?.value} value={section?.value}>
                {section?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-6">
        {filteredFeedback?.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {filteredFeedback?.map((feedback) => (
              <FeedbackCard
                key={feedback?.id}
                feedback={feedback}
                onHighlight={onHighlight}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 md:py-12">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Icon name="Search" size={32} className="text-muted-foreground" />
            </div>
            <h4 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">
              No Feedback Found
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xs">
              Try adjusting your filters to see more feedback suggestions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPanel;