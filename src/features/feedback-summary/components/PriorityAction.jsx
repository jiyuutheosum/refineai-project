import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PriorityAction = ({ title, description, difficulty, impact, category, onCheck }) => {
  const [isChecked, setIsChecked] = React.useState(false);

  const getDifficultyConfig = () => {
    switch (difficulty) {
      case 'easy':
        return { color: 'text-success', bgColor: 'bg-success/10', label: 'Easy' };
      case 'medium':
        return { color: 'text-warning', bgColor: 'bg-warning/10', label: 'Medium' };
      case 'hard':
        return { color: 'text-error', bgColor: 'bg-error/10', label: 'Hard' };
      default:
        return { color: 'text-muted-foreground', bgColor: 'bg-muted', label: 'Unknown' };
    }
  };

  const difficultyConfig = getDifficultyConfig();

  const handleCheck = () => {
    setIsChecked(!isChecked);
    if (onCheck) onCheck(!isChecked);
  };

  return (
    <div className={`bg-card border-2 rounded-xl p-4 md:p-5 transition-smooth hover:shadow-elevation-2 ${isChecked ? 'border-success bg-success/5' : 'border-border'}`}>
      <div className="flex items-start gap-3 md:gap-4">
        <button
          onClick={handleCheck}
          className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-md border-2 flex items-center justify-center transition-smooth ${
            isChecked 
              ? 'bg-success border-success' :'border-border hover:border-primary'
          }`}
        >
          {isChecked && <Icon name="Check" size={14} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className={`text-sm md:text-base font-heading font-semibold transition-smooth ${isChecked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {title}
            </h4>
            <div className={`${difficultyConfig?.bgColor} px-2 py-1 rounded-md flex-shrink-0`}>
              <span className={`text-xs font-medium ${difficultyConfig?.color}`}>
                {difficultyConfig?.label}
              </span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground mb-3 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <div className="flex items-center gap-1.5">
              <Icon name="Target" size={14} className="text-primary" />
              <span className="text-xs text-muted-foreground">Impact:</span>
              <span className="text-xs font-medium text-foreground">{impact}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="Tag" size={14} className="text-secondary" />
              <span className="text-xs font-medium text-foreground">{category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriorityAction;