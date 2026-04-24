import React from 'react';
import Icon from '../../../components/AppIcon';

const ValidationMessage = ({ type, message }) => {
  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'CheckCircle2',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          textColor: 'text-success',
          iconColor: 'text-success'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          textColor: 'text-error',
          iconColor: 'text-error'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          textColor: 'text-warning',
          iconColor: 'text-warning'
        };
      case 'info':
      default:
        return {
          icon: 'Info',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          textColor: 'text-primary',
          iconColor: 'text-primary'
        };
    }
  };

  const config = getConfig();

  if (!message) return null;

  return (
    <div className={`
      flex items-start gap-3 p-4 md:p-5 rounded-xl border transition-smooth
      ${config?.bgColor} ${config?.borderColor}
    `}>
      <Icon 
        name={config?.icon} 
        size={20} 
        className={`${config?.iconColor} flex-shrink-0 mt-0.5`}
      />
      <p className={`text-sm md:text-base ${config?.textColor} leading-relaxed`}>
        {message}
      </p>
    </div>
  );
};

export default ValidationMessage;