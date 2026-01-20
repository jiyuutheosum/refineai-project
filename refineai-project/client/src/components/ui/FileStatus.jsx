import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const FileStatus = ({ fileContext = {}, onReupload }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    fileName = 'No file uploaded',
    fileSize = null,
    uploadDate = null,
    processingStatus = 'idle',
    analysisComplete = false
  } = fileContext;

  const getStatusConfig = () => {
    switch (processingStatus) {
      case 'uploading':
        return {
          icon: 'Upload',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          label: 'Uploading...'
        };
      case 'processing':
        return {
          icon: 'Loader2',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Processing...',
          animate: true
        };
      case 'complete':
        return {
          icon: 'CheckCircle2',
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Ready'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          color: 'text-error',
          bgColor: 'bg-error/10',
          label: 'Error'
        };
      default:
        return {
          icon: 'FileText',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          label: 'No file'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb?.toFixed(1)} KB` : `${(kb / 1024)?.toFixed(1)} MB`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg shadow-elevation-3
            bg-card border border-border transition-smooth hover-lift
          `}>

          <div className={`${statusConfig?.bgColor} p-1.5 rounded-md`}>
            <Icon
              name={statusConfig?.icon}
              size={16}
              className={`${statusConfig?.color} ${statusConfig?.animate ? 'animate-spin' : ''}`} />

          </div>
          <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
        </button>

        {isExpanded &&
        <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-elevation-4 p-4 animate-fade-in">
            <div className="flex items-start gap-3 mb-3">
              <div className={`${statusConfig?.bgColor} p-2 rounded-lg`}>
                <Icon
                name={statusConfig?.icon}
                size={20}
                className={`${statusConfig?.color} ${statusConfig?.animate ? 'animate-spin' : ''}`} />

              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{fileName}</p>
                <p className={`text-xs ${statusConfig?.color} mt-0.5`}>{statusConfig?.label}</p>
              </div>
            </div>

            {fileSize &&
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Icon name="HardDrive" size={12} />
                <span>{formatFileSize(fileSize)}</span>
              </div>
          }

            {uploadDate &&
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Icon name="Clock" size={12} />
                <span>{formatDate(uploadDate)}</span>
              </div>
          }

            {onReupload &&
          <Button
            variant="outline"
            size="sm"
            iconName="Upload"
            iconPosition="left"
            onClick={onReupload}
            fullWidth>

                Upload New File
              </Button>
          }
          </div>
        }
      </div>
      <div className="hidden lg:block">
        <div className="bg-card border border-border rounded-lg shadow-elevation-3 p-4 w-80 transition-smooth mt-12 mb-0 pb-4">
          <div className="flex items-start gap-3 mb-3">
            <div className={`${statusConfig?.bgColor} p-2 rounded-lg`}>
              <Icon
                name={statusConfig?.icon}
                size={20}
                className={`${statusConfig?.color} ${statusConfig?.animate ? 'animate-spin' : ''}`} />

            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{fileName}</p>
              <p className={`text-xs ${statusConfig?.color} mt-0.5`}>{statusConfig?.label}</p>
            </div>
          </div>

          {fileSize &&
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Icon name="HardDrive" size={12} />
              <span>{formatFileSize(fileSize)}</span>
            </div>
          }

          {uploadDate &&
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Icon name="Clock" size={12} />
              <span>{formatDate(uploadDate)}</span>
            </div>
          }

          {analysisComplete &&
          <div className="flex items-center gap-2 px-3 py-2 bg-success/10 rounded-lg mb-3">
              <Icon name="CheckCircle2" size={14} className="text-success" />
              <span className="text-xs font-medium text-success">Analysis Complete</span>
            </div>
          }

          {onReupload &&
          <Button
            variant="outline"
            size="sm"
            iconName="Upload"
            iconPosition="left"
            onClick={onReupload}
            fullWidth>

              Upload New File
            </Button>
          }
        </div>
      </div>
    </div>);

};

export default FileStatus;