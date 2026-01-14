import React from 'react';
import Icon from '../../../components/AppIcon';

const ScoreCard = ({ category, score, description, color, icon }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 transition-smooth hover:shadow-elevation-2">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${color} p-2 md:p-3 rounded-lg`}>
            <Icon name={icon} size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">{category}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <div className={`text-2xl md:text-3xl font-heading font-bold ${getScoreColor(score)}`}>
          {score}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className={`font-medium ${getScoreColor(score)}`}>{score}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor(score)} transition-all duration-500 rounded-full`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;