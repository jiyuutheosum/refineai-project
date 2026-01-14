import React from 'react';
import Icon from '../../../components/AppIcon';

const FileRequirements = () => {
  const requirements = [
    {
      icon: 'FileText',
      title: 'Supported Formats',
      items: ['PDF (.pdf)', 'Microsoft Word (.docx)'],
      color: 'text-primary'
    },
    {
      icon: 'HardDrive',
      title: 'File Size',
      items: ['Minimum: 2 MB', 'Maximum: 5 MB'],
      color: 'text-secondary'
    },
    {
      icon: 'CheckCircle2',
      title: 'Best Practices',
      items: ['Use clear formatting', 'Include all relevant sections', 'Avoid images or graphics'],
      color: 'text-success'
    }
  ];

  return (
    <div className="bg-muted/50 border border-border rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Info" size={20} className="text-primary" />
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
          File Requirements
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {requirements?.map((req, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon name={req?.icon} size={18} className={req?.color} />
              <h4 className="text-sm md:text-base font-medium text-foreground">
                {req?.title}
              </h4>
            </div>
            <ul className="space-y-2">
              {req?.items?.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                  <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileRequirements;