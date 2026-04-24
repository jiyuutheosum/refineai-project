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

import useResumeUpload from './hooks/useResumeUpload'
import { HELP_CONTENT } from './constants/upload.constants'

const ResumeUploadPage = () => {
  const {
    selectedFile,
    validationState,
    isProcessing,
    processingProgress,
    handleFileSelect,
    handleReupload,
  } = useResumeUpload()

  const workflowState = {
    completedPhases: []
  }

  const helpContent = HELP_CONTENT



  return (
    <div className="min-h-screen bg-background">
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
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
              Upload Your Resume
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Get AI-powered educational feedback to improve your resume. Upload your file to begin the analysis process.
            </p>
          </div>

          {!isProcessing ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
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

                <FileRequirements />
              </div>

              <div className="lg:col-span-1">
                <InfoPanel />
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
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
          )}
        </div>
      </main>
      <HelpContext helpContent={helpContent} />
    </div>
  );
};

export default () => null; // Deprecated - use pages/ResumeUploadPage.jsx
