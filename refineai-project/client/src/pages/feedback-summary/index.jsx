import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import FileStatus from '../../components/ui/FileStatus';
import HelpContext from '../../components/ui/HelpContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import OverallScore from './components/OverallScore';
import ScoreCard from './components/ScoreCard';
import SectionBreakdown from './components/SectionBreakdown';
import PriorityAction from './components/PriorityAction';
import ResourceCard from './components/ResourceCard';
import ExportOptions from './components/ExportOptions';

const FeedbackSummary = () => {
  const navigate = useNavigate();
  const [workflowState] = useState({
    completedPhases: ['/resume-upload', '/resume-analysis', '/manual-resume-editor']
  });

  const [fileContext] = useState({
    fileName: 'Sarah_Johnson_Resume.pdf',
    fileSize: 2457600,
    uploadDate: new Date('2026-01-10T10:30:00'),
    processingStatus: 'complete',
    analysisComplete: true
  });

  const [summaryData] = useState({
    overallScore: 72,
    totalIssues: 18,
    strengths: 12,
    improvements: 6,
    categoryScores: [
      {
        category: 'Impact',
        score: 68,
        description: 'Demonstrates results and achievements',
        color: 'bg-primary/10',
        icon: 'Target'
      },
      {
        category: 'Clarity',
        score: 78,
        description: 'Clear and concise communication',
        color: 'bg-secondary/10',
        icon: 'Eye'
      },
      {
        category: 'Specificity',
        score: 65,
        description: 'Concrete details and metrics',
        color: 'bg-warning/10',
        icon: 'Hash'
      },
      {
        category: 'Relevance',
        score: 75,
        description: 'Aligned with target roles',
        color: 'bg-success/10',
        icon: 'CheckCircle2'
      }
    ],
    sectionBreakdowns: [
      {
        section: 'Education',
        status: 'excellent',
        findings: [
          'Clear degree information with graduation dates',
          'Relevant coursework listed appropriately',
          'GPA included where beneficial (3.8/4.0)'
        ],
        recommendations: [
          'Consider adding relevant academic projects',
          'Include any honors or awards received'
        ]
      },
      {
        section: 'Skills',
        status: 'good',
        findings: [
          'Technical skills clearly categorized',
          'Programming languages with proficiency levels',
          'Tools and frameworks appropriately listed'
        ],
        recommendations: [
          'Add specific project examples for key skills',
          'Consider grouping by skill category for better readability',
          'Include soft skills relevant to target roles'
        ]
      },
      {
        section: 'Experience',
        status: 'needs-improvement',
        findings: [
          'Job titles and companies clearly stated',
          'Some bullet points lack quantifiable results',
          'Action verbs used inconsistently'
        ],
        recommendations: [
          'Add metrics to demonstrate impact (e.g., "increased efficiency by 25%")',
          'Start all bullet points with strong action verbs',
          'Focus on achievements rather than responsibilities',
          'Quantify results wherever possible'
        ]
      },
      {
        section: 'Projects',
        status: 'good',
        findings: [
          'Project titles and technologies clearly listed',
          'Brief descriptions provided for each project',
          'Links to GitHub repositories included'
        ],
        recommendations: [
          'Add specific outcomes or results for each project',
          'Mention team size if collaborative projects',
          'Highlight your specific contributions'
        ]
      },
      {
        section: 'Certifications',
        status: 'excellent',
        findings: [
          'Relevant certifications with issue dates',
          'Certification providers clearly stated',
          'Expiration dates included where applicable'
        ],
        recommendations: [
          'Consider adding certification IDs for verification',
          'Pursue additional certifications aligned with career goals'
        ]
      }
    ],
    priorityActions: [
      {
        title: 'Add Quantifiable Metrics to Experience Section',
        description: 'Transform responsibility statements into achievement statements with specific numbers, percentages, or measurable outcomes to demonstrate your impact.',
        difficulty: 'medium',
        impact: 85,
        category: 'Impact'
      },
      {
        title: 'Strengthen Action Verbs Throughout Resume',
        description: 'Replace weak verbs like "helped" or "worked on" with powerful action verbs like "spearheaded," "optimized," or "implemented" to convey leadership and initiative.',
        difficulty: 'easy',
        impact: 70,
        category: 'Clarity'
      },
      {
        title: 'Include Specific Project Outcomes',
        description: 'For each project listed, add concrete results such as user adoption rates, performance improvements, or problem-solving impact to showcase your technical abilities.',
        difficulty: 'medium',
        impact: 75,
        category: 'Specificity'
      }
    ],
    educationalResources: [
      {
        title: 'Writing Impactful Resume Bullet Points',
        description: 'Learn how to transform basic job descriptions into compelling achievement statements that capture recruiter attention.',
        type: 'article',
        duration: '10 min read',
        difficulty: 'beginner',
        link: 'https://example.com/resume-bullets'
      },
      {
        title: 'Quantifying Your Achievements',
        description: 'Master the art of adding metrics and numbers to your resume to demonstrate measurable impact in your previous roles.',
        type: 'video',
        duration: '15 min',
        difficulty: 'beginner',
        link: 'https://example.com/quantify-achievements'
      },
      {
        title: 'Resume Optimization for ATS Systems',
        description: 'Understand how Applicant Tracking Systems work and optimize your resume to pass automated screening processes.',
        type: 'course',
        duration: '2 hours',
        difficulty: 'intermediate',
        link: 'https://example.com/ats-optimization'
      },
      {
        title: 'Professional Resume Templates',
        description: 'Access a collection of ATS-friendly resume templates designed for various industries and experience levels.',
        type: 'template',
        duration: 'Instant access',
        difficulty: 'beginner',
        link: 'https://example.com/resume-templates'
      }
    ]
  });

  const [checkedActions, setCheckedActions] = useState(new Set());

  const handleActionCheck = (index, isChecked) => {
    const newChecked = new Set(checkedActions);
    if (isChecked) {
      newChecked?.add(index);
    } else {
      newChecked?.delete(index);
    }
    setCheckedActions(newChecked);
  };

  const handleExport = (type, email) => {
    if (type === 'pdf') {
      console.log('Exporting PDF summary...');
    } else if (type === 'email') {
      console.log(`Sending summary to ${email}...`);
    }
  };

  const handleReupload = () => {
    navigate('/resume-upload');
  };

  const helpContent = {
    title: 'Understanding Your Summary',
    description: 'Learn how to interpret and act on your feedback',
    sections: [
      {
        title: 'Overall Score Explained',
        icon: 'Award',
        content: 'Your overall score (0-100) reflects the combined quality across Impact, Clarity, Specificity, and Relevance. Scores above 80 indicate excellent resume quality, while scores below 60 suggest significant improvement opportunities.',
        tips: [
          'Focus on categories with lower scores first',
          'Aim for balanced improvement across all categories',
          'Track progress by re-analyzing after making changes'
        ]
      },
      {
        title: 'Priority Actions Guide',
        icon: 'Target',
        content: 'Priority actions are ranked by potential impact on your resume quality. Difficulty ratings help you plan your improvement strategy, starting with easy wins before tackling complex changes.',
        tips: [
          'Complete easy tasks first to build momentum',
          'High-impact actions should be prioritized regardless of difficulty',
          'Check off completed actions to track your progress'
        ]
      },
      {
        title: 'Using Educational Resources',
        icon: 'BookOpen',
        content: 'Recommended resources are curated based on your specific improvement areas. These materials provide deeper understanding of resume best practices and help you develop long-term writing skills.',
        tips: [
          'Start with beginner resources if new to resume writing',
          'Apply learnings immediately to your resume',
          'Revisit resources as you progress in your career'
        ]
      }
    ],
    aiDisclaimer: true
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProgressIndicator workflowState={workflowState} />
      <FileStatus fileContext={fileContext} onReupload={handleReupload} />
      <HelpContext helpContent={helpContent} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 p-2 md:p-3 rounded-xl">
              <Icon name="FileText" size={24} className="text-primary md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
                Feedback Summary
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Comprehensive analysis of your resume with actionable insights
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <OverallScore
            score={summaryData?.overallScore}
            totalIssues={summaryData?.totalIssues}
            strengths={summaryData?.strengths}
            improvements={summaryData?.improvements}
          />

          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4 md:mb-6">
              Category Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {summaryData?.categoryScores?.map((category, index) => (
                <ScoreCard key={index} {...category} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">
                Priority Actions
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="CheckCircle2" size={16} className="text-success" />
                <span>{checkedActions?.size} of {summaryData?.priorityActions?.length} completed</span>
              </div>
            </div>
            <div className="space-y-3 md:space-y-4">
              {summaryData?.priorityActions?.map((action, index) => (
                <PriorityAction
                  key={index}
                  {...action}
                  onCheck={(isChecked) => handleActionCheck(index, isChecked)}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4 md:mb-6">
              Section Analysis
            </h2>
            <div className="space-y-3 md:space-y-4">
              {summaryData?.sectionBreakdowns?.map((section, index) => (
                <SectionBreakdown key={index} {...section} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4 md:mb-6">
              Educational Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {summaryData?.educationalResources?.map((resource, index) => (
                <ResourceCard key={index} {...resource} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <ExportOptions onExport={handleExport} />

            <div className="bg-card border border-border rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <Icon name="ArrowRight" size={20} className="text-secondary" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                    Next Steps
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Continue improving your resume
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="default"
                  iconName="Edit"
                  iconPosition="left"
                  onClick={() => navigate('/manual-resume-editor')}
                  fullWidth
                >
                  Edit Resume
                </Button>

                <Button
                  variant="outline"
                  iconName="FileSearch"
                  iconPosition="left"
                  onClick={() => navigate('/resume-analysis')}
                  fullWidth
                >
                  View Detailed Analysis
                </Button>

                <Button
                  variant="outline"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={() => navigate('/resume-upload')}
                  fullWidth
                >
                  Analyze New Resume
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-6">
            <div className="flex items-start gap-3">
              <Icon name="Lightbulb" size={20} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">
                  Pro Tip: Iterative Improvement
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Resume improvement is an ongoing process. Focus on implementing 2-3 priority actions at a time, 
                  then re-analyze to see your progress. This iterative approach helps you learn resume writing 
                  principles while building a stronger application. Remember, the goal is to understand why changes 
                  improve your resume, not just to achieve a higher score.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedbackSummary;