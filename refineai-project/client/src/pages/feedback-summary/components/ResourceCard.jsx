import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResourceCard = ({ title, description, type, duration, difficulty, link }) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'article':
        return { icon: 'FileText', color: 'text-primary', bgColor: 'bg-primary/10' };
      case 'video':
        return { icon: 'Video', color: 'text-error', bgColor: 'bg-error/10' };
      case 'course':
        return { icon: 'GraduationCap', color: 'text-secondary', bgColor: 'bg-secondary/10' };
      case 'template':
        return { icon: 'Layout', color: 'text-warning', bgColor: 'bg-warning/10' };
      default:
        return { icon: 'BookOpen', color: 'text-muted-foreground', bgColor: 'bg-muted' };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 transition-smooth hover:shadow-elevation-2">
      <div className="flex items-start gap-3 mb-3">
        <div className={`${typeConfig?.bgColor} p-2 rounded-lg flex-shrink-0`}>
          <Icon name={typeConfig?.icon} size={18} className={typeConfig?.color} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-1">
            {title}
          </h4>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {duration && (
          <div className="flex items-center gap-1.5">
            <Icon name="Clock" size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{duration}</span>
          </div>
        )}
        {difficulty && (
          <div className="flex items-center gap-1.5">
            <Icon name="BarChart3" size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground capitalize">{difficulty}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Icon name="Tag" size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground capitalize">{type}</span>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        iconName="ExternalLink"
        iconPosition="right"
        fullWidth
        onClick={() => window.open(link, '_blank')}
      >
        View Resource
      </Button>
    </div>
  );
};

export default ResourceCard;