import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFileSelect, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e?.dataTransfer?.items && e?.dataTransfer?.items?.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter - 1 === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = e?.dataTransfer?.files;
    if (files && files?.length > 0) {
      onFileSelect(files?.[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e?.target?.files;
    if (files && files?.length > 0) {
      onFileSelect(files?.[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl transition-smooth
        ${isDragging 
          ? 'border-primary bg-primary/5 shadow-elevation-3' 
          : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30'
        }
        ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isProcessing}
        aria-label="Upload resume file"
      />

      <div className="flex flex-col items-center justify-center px-6 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <div className={`
          flex items-center justify-center w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 
          rounded-full mb-6 md:mb-8 transition-smooth
          ${isDragging ? 'bg-primary/20 scale-110' : 'bg-primary/10'}
        `}>
          <Icon 
            name={isDragging ? "Download" : "Upload"} 
            size={32} 
            className={`${isDragging ? 'text-primary animate-bounce' : 'text-primary'}`}
          />
        </div>

        <h3 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground mb-3 md:mb-4 text-center">
          {isDragging ? 'Drop your resume here' : 'Upload Your Resume'}
        </h3>

        <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 text-center max-w-md">
          Drag and drop your resume file here, or click the button below to browse
        </p>

        <Button
          variant="default"
          size="lg"
          iconName="FileText"
          iconPosition="left"
          onClick={handleBrowseClick}
          disabled={isProcessing}
          className="mb-6 md:mb-8"
        >
          Browse Files
        </Button>

        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-success/10 rounded-lg">
                <Icon name="FileText" size={16} className="text-success" />
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground">PDF</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-success/10 rounded-lg">
                <Icon name="FileType" size={16} className="text-success" />
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground">DOCX</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>Maximum file size: 2-5 MB</span>
          </div>
        </div>
      </div>

      {isDragging && (
        <div className="absolute inset-0 bg-primary/5 rounded-2xl pointer-events-none" />
      )}
    </div>
  );
};

export default UploadZone;