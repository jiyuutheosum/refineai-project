import React from 'react'
import ProgressIndicator from '@/shared/components/feedback/ProgressIndicator'
import FileStatus from '@/shared/components/feedback/FileStatus'
import HelpContext from '@/shared/components/ui/HelpContext'
import Button from '@/shared/components/ui/Button'

import UploadZone from '@/features/resume-upload/components/UploadZone'
import ValidationMessage from '@/features/resume-upload/components/ValidationMessage'
import ProcessingIndicator from '@/features/resume-upload/components/ProcessingIndicator'
import InfoPanel from '@/features/resume-upload/components/InfoPanel'
import FileRequirements from '@/features/resume-upload/components/FileRequirements'
import ConfirmAnalysisModal from '@/features/resume-upload/components/ConfirmAnalysisModal'

import useResumeUpload from '@/features/resume-upload/hooks/useResumeUpload'
import { HELP_CONTENT } from '@/features/resume-upload/constants/upload.constants'

const workflowState = {
  completedPhases: [],
}

function ResumeUploadPage() {
  const {
    selectedFile,
    validationState,
    isProcessing,
    processingProgress,
    handleFileSelect,
    handleReupload,
    showConfirmModal,
    pendingFile,
    handleConfirmAnalysis,
    handleCancelAnalysis,
  } = useResumeUpload()

  const fileName = pendingFile?.name ?? selectedFile?.fileName ?? selectedFile?.name
  const fileSize = pendingFile?.size ?? selectedFile?.fileSize ?? selectedFile?.size

  const hasValidationMessage =
    validationState?.type && validationState?.message

  return (
    <div className="min-h-screen bg-background">
      <ProgressIndicator workflowState={workflowState} />

      {selectedFile && (
        <FileStatus
          fileContext={{
            fileName,
            fileSize,
            uploadDate: selectedFile.uploadDate,
            processingStatus: isProcessing ? 'processing' : 'complete',
            analysisComplete: false,
          }}
          onReupload={handleReupload}
        />
      )}

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 text-center md:mb-12 lg:mb-16">
            <h1 className="mb-4 text-3xl font-bold text-foreground md:mb-6 md:text-4xl lg:text-5xl">
              Upload Your Resume
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Get AI-powered educational feedback to improve your resume. Upload
              your file to begin the analysis process.
            </p>
          </header>

          {isProcessing ? (
            <section className="mx-auto max-w-2xl">
              <ProcessingIndicator
                fileName={fileName}
                progress={processingProgress}
              />

              <div className="mt-8 text-center">
                <Button variant="outline" size="lg" onClick={handleReupload}>
                  Cancel Upload
                </Button>
              </div>
            </section>
          ) : (
            <section className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-3 lg:gap-12">
              <div className="space-y-6 md:space-y-8 lg:col-span-2">
                <UploadZone onFileSelect={handleFileSelect} />

                {hasValidationMessage && (
                  <ValidationMessage
                    type={validationState.type}
                    message={validationState.message}
                  />
                )}

                <FileRequirements />
              </div>

              <aside className="lg:col-span-1">
                <InfoPanel />
              </aside>
            </section>
          )}
        </div>
      </main>

      <HelpContext helpContent={HELP_CONTENT} />

      <ConfirmAnalysisModal
        isOpen={showConfirmModal}
        fileName={fileName}
        fileSize={fileSize}
        onConfirm={handleConfirmAnalysis}
        onCancel={handleCancelAnalysis}
      />
    </div>
  )
}

export default ResumeUploadPage
