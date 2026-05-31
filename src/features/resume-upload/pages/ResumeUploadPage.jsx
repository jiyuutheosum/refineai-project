import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressIndicator from '@/shared/components/feedback/ProgressIndicator'
import FileStatus from '@/shared/components/feedback/FileStatus'
import HelpContext from '@/shared/components/ui/HelpContext'
import Button from '@/shared/components/ui/Button'
import Icon from '@/shared/components/AppIcon'

import UploadZone from '@/features/resume-upload/components/UploadZone'
import ValidationMessage from '@/features/resume-upload/components/ValidationMessage'
import ProcessingIndicator from '@/features/resume-upload/components/ProcessingIndicator'
import InfoPanel from '@/features/resume-upload/components/InfoPanel'
import FileRequirements from '@/features/resume-upload/components/FileRequirements'
import ConfirmAnalysisModal from '@/features/resume-upload/components/ConfirmAnalysisModal'

import useResumeUpload from '@/features/resume-upload/hooks/useResumeUpload'
import { HELP_CONTENT } from '@/features/resume-upload/constants/upload.constants'
import { TEMPLATES } from '@/features/manual-resume-editor/components/TemplatePreview'

const workflowState = {
  completedPhases: [],
}

function ResumeUploadPage() {
  const navigate = useNavigate()
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

  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('classic')

  const fileName = pendingFile?.name ?? selectedFile?.fileName ?? selectedFile?.name
  const fileSize = pendingFile?.size ?? selectedFile?.fileSize ?? selectedFile?.size

  const hasValidationMessage =
    validationState?.type && validationState?.message

  const handleStartBuilding = () => {
    navigate('/manual-resume-editor', {
      state: {
        scratch: true,
        selectedTemplate,
      },
    })
    setShowTemplateModal(false)
  }

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
            <h1 className="font-heading text-5xl font-bold tracking-tight">
              Upload Your Resume
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Get AI-powered educational feedback to improve your resume. Upload
              your file to begin the analysis process.
            </p>
          </header>

          {/* Prominent "Build from Scratch" option placed in the upper-middle area */}
          <div className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-2 flex items-center justify-center gap-2 text-primary">
                <Icon name="Edit3" size={20} />
                <span className="text-sm font-semibold tracking-wide">NEW OPTION</span>
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-foreground">
                Don&apos;t have a resume yet?
              </h3>
              <p className="mb-5 text-muted-foreground">
                Build a professional resume from scratch using one of our clean templates.
              </p>
              <Button
                size="lg"
                onClick={() => setShowTemplateModal(true)}
                className="gap-2 px-8"
              >
                <Icon name="FileText" size={18} />
                Choose a Template &amp; Start Building
              </Button>
            </div>
          </div>

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

      {/* Template Selection Modal for Building from Scratch */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl border bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Choose a Template</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select a professional layout to start building your resume.
                </p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {TEMPLATES.map((template) => {
                const isSelected = selectedTemplate === template.id
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      isSelected
                        ? `${template.accent} border-primary bg-primary/5 shadow-sm`
                        : 'border-border hover:border-muted-foreground/40 hover:bg-muted/50'
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-base font-semibold">{template.label}</span>
                      {isSelected && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">{template.description}</p>
                    {/* Simple visual preview */}
                    <div className={`h-20 rounded-md border ${template.preview} p-3 text-[10px]`}>
                      {template.id === 'classic' && 'Clean & Timeless'}
                      {template.id === 'traditional' && 'Bold & Structured'}
                      {template.id === 'modern' && 'Modern Sidebar'}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleStartBuilding}>
                Start Building with {TEMPLATES.find(t => t.id === selectedTemplate)?.label}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeUploadPage
