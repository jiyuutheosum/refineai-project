import React from 'react';
import Icon from '../../../components/AppIcon';

const OverallScore = ({ score, totalIssues, strengths, improvements }) => {
  const getScoreLevel = () => {
    if (score >= 80) return { label: 'Excellent', color: 'text-success', bgColor: 'bg-success/10', icon: 'Award' };
    if (score >= 60) return { label: 'Good', color: 'text-primary', bgColor: 'bg-primary/10', icon: 'ThumbsUp' };
    if (score >= 40) return { label: 'Fair', color: 'text-warning', bgColor: 'bg-warning/10', icon: 'AlertCircle' };
    return { label: 'Needs Work', color: 'text-error', bgColor: 'bg-error/10', icon: 'AlertTriangle' };
  };

  const scoreLevel = getScoreLevel();

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-2xl p-6 md:p-8">
      <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8">
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="var(--color-muted)"
                strokeWidth="8"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="8"
                strokeDasharray={`${score * 2.83} 283`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-heading font-bold text-foreground">{score}</span>
              <span className="text-xs md:text-sm text-muted-foreground">out of 100</span>
            </div>
          </div>
        </div>

        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
            <div className={`${scoreLevel?.bgColor} p-2 rounded-lg`}>
              <Icon name={scoreLevel?.icon} size={20} className={scoreLevel?.color} />
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              {scoreLevel?.label} Resume
            </h2>
          </div>

          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed max-w-2xl">
            Your resume shows strong potential with {strengths} key strengths identified. 
            Focus on addressing {improvements} improvement areas to enhance your application success rate.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Icon name="CheckCircle2" size={18} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Strengths</p>
                <p className="text-lg md:text-xl font-heading font-bold text-foreground">{strengths}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-warning/10 p-2 rounded-lg">
                <Icon name="AlertCircle" size={18} className="text-warning" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">To Improve</p>
                <p className="text-lg md:text-xl font-heading font-bold text-foreground">{improvements}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <Icon name="FileText" size={18} className="text-secondary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Total Issues</p>
                <p className="text-lg md:text-xl font-heading font-bold text-foreground">{totalIssues}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallScore;