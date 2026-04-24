import React from 'react';
import ProgressIndicator from '../../../shared/components/feedback/ProgressIndicator';
import FileStatus from '../../../shared/components/feedback/FileStatus';
import HelpContext from '../../../shared/components/ui/HelpContext';
import UploadZone from '../components/UploadZone';
import ValidationMessage from '../components/ValidationMessage';
import ProcessingIndicator from '../components/ProcessingIndicator';
import InfoPanel from '../components/InfoPanel';
import FileRequirements from '../components/FileRequirements';
import Button from '../../../shared/components/ui/Button';

import useResumeUpload from '../hooks/useResumeUpload';
import { HELP_CONTENT } from '../constants/upload.constants';

const ResumeUploadPage = () => {
  const {
    selectedFile,
    validationState,
    isProcessing,
    processingProgress,
    handleFileSelect,
    handleReupload,
  } = useResumeUpload();

  const workflowState = {
    completedPhases: [],
  };

  const helpContent = HELP_CONTENT;

  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator workflowState={workflowState} />

      {selectedFile && (
        <FileStatus
          fileContext={{
            fileName: selectedFile?.fileName ?? selectedFile?.name,
            fileSize: selectedFile?.fileSize ?? selectedFile?.size,
            uploadDate: selectedFile?.uploadDate,
            processingStatus: isProcessing ? 'processing' : 'complete',
            analysisComplete: false,
          }}
          onReupload={handleReupload}
        />
      )}

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center md:mb-12 lg:mb-16">
            <h1 className="mb-4 text-3xl font-bold text-foreground md:mb-6 md:text-4xl lg:text-5xl">
              Upload Your Resume
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
              Get AI-powered educational feedback to improve your resume. Upload
              your file to begin the analysis process.
            </p>
          </div>

          {!isProcessing ? (
            <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-3 lg:gap-12">
              <div className="space-y-6 md:space-y-8 lg:col-span-2">
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
            <div className="mx-auto max-w-2xl">
              <ProcessingIndicator
                fileName={selectedFile?.fileName ?? selectedFile?.name}
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

export default ResumeUploadPage;