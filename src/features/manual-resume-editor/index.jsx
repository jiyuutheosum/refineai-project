import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import FileStatus from '../../components/ui/FileStatus';
import HelpContext from '../../components/ui/HelpContext';
import SectionEditor from './components/SectionEditor';
import FeedbackSidebar from './components/FeedbackSidebar';
import ComparisonView from './components/ComparisonView';
import TemplateHelper from './components/TemplateHelper';

const ManualResumeEditor = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(new Date());

  const [resumeSections, setResumeSections] = useState([
    {
      id: 1,
      section: 'Education',
      content: `Bachelor of Science in Computer Science\nState University, Boston, MA\nExpected Graduation: May 2026\nGPA: 3.7/4.0\n\nRelevant Coursework: Data Structures, Web Development, Database Systems`
    },
    {
      id: 2,
      section: 'Skills',
      content: `Programming: Python, JavaScript, Java\nWeb: React, HTML, CSS\nTools: Git, VS Code\nDatabases: MySQL, MongoDB`
    },
    {
      id: 3,
      section: 'Experience',
      content: `Student Web Developer\nUniversity IT Department\nSeptember 2025 - Present\n\n• Help maintain university website\n• Work with team on projects\n• Learn new technologies`
    },
    {
      id: 4,
      section: 'Projects',
      content: `Personal Portfolio Website\nBuilt website using React\nShows my projects and skills\nDeployed on Netlify`
    },
    {
      id: 5,
      section: 'Certifications',
      content: `Introduction to Web Development\nCoursera\nCompleted: August 2025`
    }
  ]);

  const [originalSections] = useState(resumeSections);

  const feedbackItems = [
    {
      id: 1,
      section: 'Experience',
      category: 'Impact',
      icon: 'TrendingUp',
      title: 'Add measurable results',
      reason: 'Quantifying your achievements helps employers understand the scale and impact of your work. Numbers make your contributions concrete and memorable.',
      suggestion: 'Instead of "Help maintain university website", try "Maintained university website serving 15,000+ students, reducing page load time by 25%"',
      example: 'Improved system performance by 40% through code optimization'
    },
    {
      id: 2,
      section: 'Experience',
      category: 'Clarity',
      icon: 'Eye',
      title: 'Use stronger action verbs',
      reason: 'Weak verbs like "help" and "work" don\'t showcase your actual contributions. Strong action verbs demonstrate ownership and initiative.',
      suggestion: 'Replace "Help maintain" with "Maintained" or "Managed". Replace "Work with team" with "Collaborated with" or "Partnered with"',
      example: 'Developed, Implemented, Designed, Led, Optimized'
    },
    {
      id: 3,
      section: 'Projects',
      category: 'Specificity',
      icon: 'Target',
      title: 'Provide technical details',
      reason: 'Generic descriptions don\'t demonstrate your technical skills. Specific technologies and methodologies show your expertise level.',
      suggestion: 'Expand "Built website using React" to include specific features, libraries used, and technical challenges solved',
      example: 'Developed responsive portfolio using React 18, React Router, and Tailwind CSS with dynamic content loading'
    },
    {
      id: 4,
      section: 'Skills',
      category: 'Relevance',
      icon: 'CheckCircle2',
      title: 'Organize by proficiency',
      reason: 'Grouping skills by category and proficiency level helps employers quickly identify your strongest areas and relevant expertise.',
      suggestion: 'Separate skills into categories like "Proficient", "Intermediate", and "Familiar" or group by type (Frontend, Backend, Tools)',
      example: 'Frontend (Proficient): React, JavaScript, HTML5, CSS3\nBackend (Intermediate): Node.js, Express, MongoDB'
    },
    {
      id: 5,
      section: 'Education',
      category: 'Impact',
      icon: 'Award',
      title: 'Highlight achievements',
      reason: 'Your GPA and coursework show academic strength, but additional achievements demonstrate leadership and initiative beyond classroom requirements.',
      suggestion: 'Add relevant achievements like "Dean\'s List", academic projects, research experience, or relevant extracurricular activities',
      example: 'Dean\'s List (Fall 2024, Spring 2025)\nLed team of 4 students in capstone project developing mobile app'
    }
  ];

  const validationRules = {
    'Experience': [
      'Consider adding measurable results or metrics',
      'Use strong action verbs to start bullet points',
      'Ensure dates are in consistent format'
    ],
    'Projects': [
      'Include specific technologies and tools used',
      'Describe the problem solved or value created',
      'Add links to live demos or repositories if available'
    ],
    'Skills': [
      'Group related skills together',
      'Consider indicating proficiency levels',
      'Focus on skills relevant to target roles'
    ]
  };

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      setAutoSaveStatus('saving');
      setTimeout(() => {
        setAutoSaveStatus('saved');
        setLastSaved(new Date());
      }, 500);
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, []);

  const handleContentChange = (sectionId, newContent) => {
    setResumeSections(prev =>
      prev?.map(section =>
        section?.id === sectionId ? { ...section, content: newContent } : section
      )
    );
    setAutoSaveStatus('saving');
    setTimeout(() => {
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
    }, 1000);
  };

  const handleDeleteSection = (sectionId) => {
    setResumeSections(prev => prev?.filter(section => section?.id !== sectionId));
  };

  const handleMoveSection = (sectionId, direction) => {
    const index = resumeSections?.findIndex(s => s?.id === sectionId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === resumeSections?.length - 1)
    ) {
      return;
    }

    const newSections = [...resumeSections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections?.[targetIndex], newSections?.[index]];
    setResumeSections(newSections);
  };

  const handleApplySuggestion = (suggestion) => {
    console.log('Applied suggestion:', suggestion);
  };

  const handleInsertTemplate = (sectionId, templateContent) => {
    setResumeSections(prev =>
      prev?.map(section =>
        section?.id === sectionId ? { ...section, content: templateContent } : section
      )
    );
  };

  const handleManualSave = () => {
    setAutoSaveStatus('saving');
    setTimeout(() => {
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
    }, 500);
  };

  const handleExport = () => {
    navigate('/feedback-summary');
  };

  const getAutoSaveText = () => {
    if (autoSaveStatus === 'saving') return 'Saving...';
    const seconds = Math.floor((new Date() - lastSaved) / 1000);
    if (seconds < 60) return 'Saved just now';
    return `Saved ${Math.floor(seconds / 60)}m ago`;
  };

  const fileContext = {
    fileName: 'resume_john_doe.pdf',
    fileSize: 245760,
    uploadDate: new Date('2026-01-10T10:30:00'),
    processingStatus: 'complete',
    analysisComplete: true
  };

  const workflowState = {
    completedPhases: ['/resume-upload', '/resume-analysis']
  };

  const helpContent = {
    title: 'Resume Editor Help',
    description: 'Learn how to effectively edit your resume',
    sections: [
      {
        title: 'Using the Editor',
        icon: 'Edit',
        content: 'Click on any section to expand and edit its content. Use the formatting toolbar to style your text with bold, italic, and underline options.',
        tips: [
          'Use the undo/redo buttons to revert changes',
          'Drag sections to reorder them',
          'Delete sections you don\'t need'
        ]
      },
      {
        title: 'AI Suggestions',
        icon: 'Lightbulb',
        content: 'Review AI-powered suggestions in the sidebar. Each suggestion explains why it matters and provides specific examples to help you improve.',
        tips: [
          'Suggestions are categorized by Impact, Clarity, Specificity, and Relevance',
          'Click on a suggestion to see detailed guidance',
          'Mark suggestions as applied to track your progress'
        ]
      },
      {
        title: 'Templates & Examples',
        icon: 'FileText',
        content: 'Use section templates to get started quickly. Templates provide professionally formatted examples you can customize for your experience.',
        tips: [
          'Templates are available for each resume section',
          'Customize templates to match your experience',
          'Use examples as inspiration, not exact copies'
        ]
      },
      {
        title: 'Saving & Exporting',
        icon: 'Save',
        content: 'Your changes are automatically saved every 30 seconds. You can also manually save at any time or export your completed resume.',
        tips: [
          'Auto-save status appears in the top bar',
          'Use manual save before closing the browser',
          'Export to view your final resume and get a summary'
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProgressIndicator workflowState={workflowState} />
      <FileStatus fileContext={fileContext} onReupload={() => navigate('/resume-upload')} />
      <HelpContext helpContent={helpContent} />
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Edit" size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Resume Editor</h1>
            <p className="text-sm text-muted-foreground">Edit your resume with AI-powered guidance</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
            <Icon 
              name={autoSaveStatus === 'saving' ? 'Loader2' : 'Check'} 
              size={14} 
              className={`${autoSaveStatus === 'saving' ? 'animate-spin text-primary' : 'text-success'}`}
            />
            <span className="text-xs text-muted-foreground">{getAutoSaveText()}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            iconName="GitCompare"
            iconPosition="left"
            onClick={() => setShowComparison(true)}
            className="hidden md:flex"
          >
            Compare
          </Button>

          <Button
            variant="outline"
            size="sm"
            iconName="Save"
            onClick={handleManualSave}
            className="hidden md:flex"
          >
            Save
          </Button>

          <Button
            variant="default"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>
      <div className="flex h-[calc(100vh-240px)] lg:h-[calc(100vh-200px)]">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-heading font-semibold text-foreground mb-1">Edit Resume Sections</h2>
                <p className="text-sm text-muted-foreground">Click on sections to expand and edit content</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                iconName="MessageSquare"
                iconPosition="left"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                {isSidebarOpen ? 'Hide' : 'Show'} Feedback
              </Button>
            </div>

            {resumeSections?.map((section, index) => (
              <div key={section?.id}>
                <TemplateHelper
                  section={section?.section}
                  onInsertTemplate={(content) => handleInsertTemplate(section?.id, content)}
                />
                <SectionEditor
                  section={section?.section}
                  content={section?.content}
                  onContentChange={(newContent) => handleContentChange(section?.id, newContent)}
                  onDelete={() => handleDeleteSection(section?.id)}
                  onMoveUp={() => handleMoveSection(section?.id, 'up')}
                  onMoveDown={() => handleMoveSection(section?.id, 'down')}
                  isFirst={index === 0}
                  isLast={index === resumeSections?.length - 1}
                  validationIssues={validationRules?.[section?.section] || []}
                />
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => navigate('/resume-analysis')}
                fullWidth
                className="sm:flex-1"
              >
                Back to Analysis
              </Button>
              <Button
                variant="default"
                iconName="ArrowRight"
                iconPosition="right"
                onClick={handleExport}
                fullWidth
                className="sm:flex-1"
              >
                Continue to Summary
              </Button>
            </div>
          </div>
        </div>

        <div className={`
          fixed lg:relative inset-y-0 right-0 w-80 lg:w-96 transform transition-transform duration-300 z-50
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-background/80 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <div className="relative h-full">
            <FeedbackSidebar
              feedbackItems={feedbackItems}
              currentSection={currentSection}
              onApplySuggestion={handleApplySuggestion}
            />
          </div>
        </div>
      </div>
      {showComparison && (
        <ComparisonView
          originalContent={originalSections}
          editedContent={resumeSections}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

export default ManualResumeEditor;