import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import FileStatus from '../../components/ui/FileStatus';
import HelpContext from '../../components/ui/HelpContext';
import UploadZone from './components/UploadZone';
import ValidationMessage from './components/ValidationMessage';
import ProcessingIndicator from './components/ProcessingIndicator';
import InfoPanel from './components/InfoPanel';
import FileRequirements from './components/FileRequirements';
import Button from '../../components/ui/Button';

const ResumeUpload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationState, setValidationState] = useState({ type: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [workflowState, setWorkflowState] = useState({
    completedPhases: []
  });

  const validateFile = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const minSize = 2 * 1024 * 1024;
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes?.includes(file?.type)) {
      return {
        valid: false,
        type: 'error',
        message: 'Invalid file format. Please upload a PDF or DOCX file only.'
      };
    }

    if (file?.size < minSize) {
      return {
        valid: false,
        type: 'error',
        message: `File size is too small (${(file?.size / 1024 / 1024)?.toFixed(2)} MB). Minimum required size is 2 MB. Please ensure your resume contains sufficient content.`
      };
    }

    if (file?.size > maxSize) {
      return {
        valid: false,
        type: 'error',
        message: `File size exceeds the limit (${(file?.size / 1024 / 1024)?.toFixed(2)} MB). Maximum allowed size is 5 MB. Please compress your file or remove unnecessary content.`
      };
    }

    return {
      valid: true,
      type: 'success',
      message: `File validated successfully! ${file?.name} (${(file?.size / 1024 / 1024)?.toFixed(2)} MB) is ready for processing.`
    };
  };

  const handleFileSelect = (file) => {
    const validation = validateFile(file);
    setValidationState({ type: validation?.type, message: validation?.message });

    if (validation?.valid) {
      setSelectedFile({
        file: file,
        fileName: file?.name,
        fileSize: file?.size,
        uploadDate: new Date(),
        processingStatus: 'uploading'
      });

      setTimeout(() => {
        setIsProcessing(true);
        simulateProcessing();
      }, 500);
    } else {
      setSelectedFile(null);
    }
  };

  const simulateProcessing = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setWorkflowState(prev => ({
            ...prev,
            completedPhases: [...prev?.completedPhases, '/resume-upload']
          }));
          navigate('/resume-analysis');
        }, 500);
      }
    }, 800);
  };

  const handleReupload = () => {
    setSelectedFile(null);
    setValidationState({ type: '', message: '' });
    setIsProcessing(false);
    setProcessingProgress(0);
  };

  const helpContent = {
    title: 'Resume Upload Help',
    description: 'Learn how to upload your resume for AI-powered feedback',
    sections: [
      {
        title: 'Supported File Formats',
        icon: 'FileText',
        content: 'We accept PDF and DOCX (Microsoft Word) formats. Make sure your resume is saved in one of these formats before uploading.',
        tips: [
          'PDF format preserves formatting across all devices',
          'DOCX files should be created in Microsoft Word 2007 or later',
          'Avoid using password-protected files'
        ]
      },
      {
        title: 'File Size Requirements',
        icon: 'HardDrive',
        content: 'Your resume file must be between 2 MB and 5 MB. This ensures we can process your document efficiently while maintaining quality.',
        tips: [
          'If your file is too small, add more relevant content',
          'If too large, compress images or remove unnecessary graphics',
          'Text-based resumes typically fall within the size range'
        ]
      },
      {
        title: 'Upload Methods',
        icon: 'Upload',
        content: 'You can upload your resume by dragging and dropping the file into the upload zone, or by clicking the "Browse Files" button to select from your device.',
        tips: [
          'Drag and drop works on desktop browsers',
          'Mobile users should use the browse button',
          'Only one file can be uploaded at a time'
        ]
      },
      {
        title: 'What Happens Next',
        icon: 'Zap',
        content: 'After uploading, our AI will analyze your resume in under 10 seconds. You will receive educational feedback on Impact, Clarity, Specificity, and Relevance.',
        tips: [
          'Processing typically takes 5-10 seconds',
          'You will be automatically redirected to the analysis screen',
          'All feedback is designed to help you learn and improve'
        ]
      }
    ],
    aiDisclaimer: true
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-card">
      <Header />
      <ProgressIndicator workflowState={workflowState} />
      {selectedFile && (
        <FileStatus 
          fileContext={{
            fileName: selectedFile?.fileName,
            fileSize: selectedFile?.fileSize,
            uploadDate: selectedFile?.uploadDate,
            processingStatus: isProcessing ? 'processing' : 'complete',
            analysisComplete: false
          }}
          onReupload={handleReupload}
        />
      )}

      {!isProcessing ? (
        <main className="flex-1 w-full px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="w-full max-w-6xl mx-auto">
            {/* Centered Header Section */}
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-4 md:mb-6">
                Upload Your Resume
              </h1>
              <p className="text-base md:text-lg text-foreground/70 max-w-3xl mx-auto">
                Get AI-powered educational feedback to improve your resume. Upload your file to begin the analysis process.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 mb-12 md:mb-16">
              {/* Left Column - Upload Zone */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <UploadZone 
                  onFileSelect={handleFileSelect}
                  isProcessing={isProcessing}
                />

                {validationState?.message && (
                  <ValidationMessage 
                    type={validationState?.type}
                    message={validationState?.message}
                  />
                )}
              </div>

              {/* Right Column - How It Works */}
              <div className="lg:col-span-1">
                <InfoPanel />
              </div>
            </div>

            {/* File Requirements - Full Width Below */}
            <div className="border-t border-border pt-12 md:pt-16">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8 text-center">
                File Requirements
              </h2>
              <FileRequirements />
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 w-full px-4 py-8 md:py-12 flex items-center justify-center">
          <div className="w-full max-w-2xl mx-auto">
            <ProcessingIndicator 
              fileName={selectedFile?.fileName}
              progress={processingProgress}
            />

            <div className="mt-8 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReupload}
              >
                Cancel Upload
              </Button>
            </div>
          </div>
        </main>
      )}

      <HelpContext helpContent={helpContent} />
    </div>
  );
};

export default ResumeUpload;