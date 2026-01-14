import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import FileStatus from '../../components/ui/FileStatus';
import HelpContext from '../../components/ui/HelpContext';
import ResumePreview from './components/ResumePreview';
import FeedbackPanel from './components/FeedbackPanel';
import ActionPanel from './components/ActionPanel';
import Icon from '../../components/AppIcon';

const ResumeAnalysis = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('split');
  const [highlightedLine, setHighlightedLine] = useState(null);

  const mockResumeContent = [
    "JOHN MICHAEL ANDERSON",
    "john.anderson@email.com | (555) 123-4567 | linkedin.com/in/johnanderson",
    "",
    "EDUCATION",
    "Bachelor of Science in Computer Science",
    "University of California, Berkeley | Expected Graduation: May 2024",
    "GPA: 3.7/4.0 | Dean's List: Fall 2022, Spring 2023",
    "",
    "TECHNICAL SKILLS",
    "Programming Languages: Python, JavaScript, Java, C++, SQL",
    "Web Technologies: React, Node.js, Express, HTML5, CSS3, REST APIs",
    "Tools & Platforms: Git, Docker, AWS, MongoDB, PostgreSQL, Jira",
    "",
    "EXPERIENCE",
    "Software Engineering Intern | Tech Solutions Inc. | June 2023 - August 2023",
    "Worked on web development projects using React and Node.js",
    "Helped improve application performance",
    "Collaborated with team members on various tasks",
    "",
    "PROJECTS",
    "E-Commerce Platform | Personal Project | January 2024 - Present",
    "Built a full-stack e-commerce website",
    "Used React for frontend and Node.js for backend",
    "Implemented user authentication and payment processing",
    "",
    "Task Management App | Academic Project | September 2023 - December 2023",
    "Created a task management application",
    "Worked with a team of 4 students",
    "Used Agile methodology for project management",
    "",
    "CERTIFICATIONS",
    "AWS Certified Cloud Practitioner | Amazon Web Services | December 2023",
    "Google IT Support Professional Certificate | Coursera | August 2023"
  ];

  const mockFeedbackData = [
    {
      id: 1,
      category: "Impact",
      section: "Experience",
      lineNumber: 16,
      title: "Vague action verb lacks measurable impact",
      reason: "The phrase 'Worked on web development projects' doesn't show what you actually accomplished or the value you brought to the company. Recruiters want to see specific contributions and results, not just tasks you were assigned.",
      suggestion: "Replace 'Worked on' with a stronger action verb that shows your specific role. For example: 'Developed', 'Engineered', 'Implemented', or 'Designed'. Then add what you built and the impact it had.",
      example: "Developed 3 customer-facing features using React and Node.js, improving user engagement by 25% based on analytics data"
    },
    {
      id: 2,
      category: "Specificity",
      section: "Experience",
      lineNumber: 17,
      title: "Missing quantifiable metrics and specific details",
      reason: "Saying you 'helped improve application performance' is too general. Without numbers or specific methods, recruiters can't understand the scope of your contribution or the technical skills you used.",
      suggestion: "Add specific metrics (percentages, time saved, users affected) and mention the technical approach you used. This shows both your impact and your technical knowledge.",
      example: "Optimized database queries and implemented Redis caching, reducing API response time by 40% and improving load times for 10,000+ daily users"
    },
    {
      id: 3,
      category: "Clarity",
      section: "Experience",
      lineNumber: 18,
      title: "Unclear contribution and passive language",
      reason: "The phrase 'Collaborated with team members on various tasks' doesn't explain what you actually did or what skills you used. It's too vague to demonstrate your value or technical abilities.",
      suggestion: "Specify your exact role in the collaboration, what you worked on together, and what the outcome was. Focus on your individual contributions within the team context.",
      example: "Collaborated with 3 senior engineers to implement RESTful APIs for user authentication, contributing 2,000+ lines of tested code to the production codebase"
    },
    {
      id: 4,
      category: "Impact",
      section: "Projects",
      lineNumber: 22,
      title: "Project description lacks technical depth and results",
      reason: "Simply stating you 'Built a full-stack e-commerce website' doesn't differentiate you from other candidates. Recruiters want to know the scale, complexity, and unique challenges you solved.",
      suggestion: "Describe the project's scope, key technical challenges you overcame, and any measurable outcomes. Include specific technologies and architectural decisions.",
      example: "Architected and deployed a full-stack e-commerce platform handling 500+ products with secure payment integration, serving 1,000+ monthly visitors with 99.9% uptime"
    },
    {
      id: 5,
      category: "Relevance",
      section: "Projects",
      lineNumber: 23,
      title: "Technology stack mentioned without context",
      reason: "Listing 'Used React for frontend and Node.js for backend' is just repeating what's in your skills section. This line should explain why you chose these technologies or what specific features you built with them.",
      suggestion: "Instead of just naming technologies, explain what you built with them or what problems they helped you solve. This shows you understand when and why to use different tools.",
      example: "Leveraged React hooks and Context API for state management, and built a Node.js/Express backend with JWT authentication to handle 50+ concurrent users"
    },
    {
      id: 6,
      category: "Specificity",
      section: "Projects",
      lineNumber: 24,
      title: "Feature implementation needs technical details",
      reason: "Saying you 'Implemented user authentication and payment processing' is good, but it's missing the technical details that show your skill level. What authentication method? Which payment gateway? What security measures?",
      suggestion: "Add specific technologies, security practices, or standards you followed. This demonstrates your understanding of industry best practices and technical depth.",
      example: "Implemented secure user authentication using bcrypt password hashing and JWT tokens, integrated Stripe payment API with webhook handling for real-time transaction updates"
    },
    {
      id: 7,
      category: "Clarity",
      section: "Projects",
      lineNumber: 27,
      title: "Generic project description lacks differentiation",
      reason: "The phrase 'Created a task management application' is too basic and doesn't explain what makes your project unique or what technical skills you demonstrated. Many students build similar projects.",
      suggestion: "Highlight what's unique about your implementation, what technical challenges you solved, or what advanced features you included. This helps your project stand out.",
      example: "Engineered a real-time collaborative task management app with WebSocket integration for live updates, supporting 20+ concurrent users with drag-and-drop functionality"
    },
    {
      id: 8,
      category: "Impact",
      section: "Projects",
      lineNumber: 28,
      title: "Team collaboration needs specific contribution details",
      reason: "Mentioning you 'Worked with a team of 4 students' doesn't show what you personally contributed or what leadership or technical skills you demonstrated in the team setting.",
      suggestion: "Specify your role in the team, what components you owned, and how you contributed to the project's success. This shows both teamwork and individual accountability.",
      example: "Led frontend development in a 4-person team, architecting the React component structure and implementing 60% of the UI features while conducting code reviews"
    },
    {
      id: 9,
      category: "Relevance",
      section: "Projects",
      lineNumber: 29,
      title: "Methodology mention without practical application",
      reason: "Simply stating you 'Used Agile methodology' doesn't demonstrate how you applied it or what you learned. Recruiters want to see practical understanding, not just buzzwords.",
      suggestion: "Explain how you applied Agile practices in your project and what benefits it brought. This shows you understand project management beyond just knowing the terminology.",
      example: "Applied Agile methodology with 2-week sprints, daily standups, and sprint retrospectives, delivering features iteratively and adapting to changing requirements throughout the semester"
    },
    {
      id: 10,
      category: "Clarity",
      section: "Skills",
      lineNumber: 10,
      title: "Skills list needs proficiency context",
      reason: "Listing many programming languages without context makes it hard for recruiters to know which ones you\'re actually strong in versus which you\'ve only briefly used. This can lead to mismatched interview questions.",
      suggestion: "Consider grouping skills by proficiency level (e.g., 'Proficient:', 'Familiar:') or focus on the languages most relevant to the jobs you're applying for. Quality over quantity helps set clear expectations.",
      example: "Proficient: Python, JavaScript, React | Familiar: Java, C++, SQL"
    }
  ];

  const mockFileContext = {
    fileName: "John_Anderson_Resume.pdf",
    fileSize: 245760,
    uploadDate: new Date(Date.now() - 3600000),
    processingStatus: "complete",
    analysisComplete: true
  };

  const mockWorkflowState = {
    completedPhases: ['/resume-upload']
  };

  const highlightedLines = mockFeedbackData?.map(f => ({
    lineNumber: f?.lineNumber,
    category: f?.category?.toLowerCase()
  }));

  const handleLineClick = (lineNumber) => {
    setHighlightedLine(lineNumber);
    const feedbackElement = document.getElementById(`feedback-${lineNumber}`);
    if (feedbackElement) {
      feedbackElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleHighlight = (lineNumber) => {
    setHighlightedLine(lineNumber);
    if (window.innerWidth < 1024) {
      setActiveView('resume');
    }
    setTimeout(() => {
      const lineElement = document.querySelector(`[data-line="${lineNumber}"]`);
      if (lineElement) {
        lineElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleDownload = () => {
    const feedbackText = mockFeedbackData?.map(f => 
      `${f?.category} - Line ${f?.lineNumber}\n${f?.title}\n\nWhy: ${f?.reason}\n\nSuggestion: ${f?.suggestion}\n${f?.example ? `\nExample: ${f?.example}` : ''}\n\n---\n\n`
    )?.join('');

    const blob = new Blob([feedbackText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-feedback-analysis.txt';
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const helpContent = {
    title: 'Understanding Your Feedback',
    description: 'Learn how to interpret and apply AI-generated suggestions',
    sections: [
      {
        title: 'Color-Coded Categories',
        icon: 'Palette',
        content: 'Feedback is organized into four categories: Impact (blue) shows where you can demonstrate stronger results, Clarity (green) highlights areas needing clearer communication, Specificity (yellow) identifies places requiring more concrete details, and Relevance (red) points out alignment with job requirements.',
        tips: [
          'Click any highlighted line in your resume to see related feedback',
          'Use category filters to focus on specific improvement areas',
          'Review all categories for comprehensive enhancement'
        ]
      },
      {
        title: 'Reading Feedback Cards',
        icon: 'BookOpen',
        content: 'Each feedback card explains why something matters, provides actionable suggestions, and often includes example improvements. The "Why This Matters" section helps you understand recruiter perspectives, while suggestions guide you toward better phrasing.',
        tips: [
          'Read the reasoning first to understand the context',
          'Use examples as inspiration, not templates to copy',
          'Apply suggestions that fit your actual experience'
        ]
      },
      {
        title: 'Taking Action',
        icon: 'CheckSquare',
        content: 'After reviewing feedback, use the Edit Resume button to make changes. Download your feedback summary for reference while editing. Remember, these are educational suggestions to help you improve, not mandatory changes.',
        tips: [
          'Prioritize high-impact changes first',
          'Keep your authentic voice and experiences',
          'Review changes before finalizing your resume'
        ]
      }
    ],
    aiDisclaimer: true
  };

  useEffect(() => {
    if (highlightedLine) {
      const timer = setTimeout(() => setHighlightedLine(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedLine]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProgressIndicator workflowState={mockWorkflowState} />
      <FileStatus fileContext={mockFileContext} onReupload={() => navigate('/resume-upload')} />
      <div className="lg:hidden px-4 py-3 bg-card border-b border-border">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('resume')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-smooth text-sm font-medium
              ${activeView === 'resume' ?'bg-primary text-primary-foreground shadow-elevation-1' :'bg-muted text-foreground'
              }
            `}
          >
            <Icon name="FileText" size={16} />
            Resume
          </button>
          <button
            onClick={() => setActiveView('feedback')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-smooth text-sm font-medium
              ${activeView === 'feedback' ?'bg-primary text-primary-foreground shadow-elevation-1' :'bg-muted text-foreground'
              }
            `}
          >
            <Icon name="MessageSquare" size={16} />
            Feedback
            <span className="px-2 py-0.5 bg-primary/20 rounded-full text-xs">
              {mockFeedbackData?.length}
            </span>
          </button>
        </div>
      </div>
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 pb-32 lg:pb-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-2">
            Resume Analysis Results
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Review AI-generated feedback to understand how to improve your resume. Each suggestion explains why it matters and how to enhance your content.
          </p>
        </div>

        <div className="lg:hidden">
          {activeView === 'resume' && (
            <div className="h-[calc(100vh-280px)]">
              <ResumePreview
                resumeContent={mockResumeContent}
                highlightedLines={highlightedLines}
                onLineClick={handleLineClick}
              />
            </div>
          )}
          {activeView === 'feedback' && (
            <div className="h-[calc(100vh-280px)]">
              <FeedbackPanel
                feedbackData={mockFeedbackData}
                onHighlight={handleHighlight}
              />
            </div>
          )}
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 gap-6 lg:gap-8 h-[calc(100vh-320px)]">
          <ResumePreview
            resumeContent={mockResumeContent}
            highlightedLines={highlightedLines}
            onLineClick={handleLineClick}
          />
          <FeedbackPanel
            feedbackData={mockFeedbackData}
            onHighlight={handleHighlight}
          />
        </div>

        <div className="mt-6 lg:mt-8">
          <ActionPanel
            feedbackCount={mockFeedbackData?.length}
            onDownload={handleDownload}
          />
        </div>
      </main>
      <HelpContext helpContent={helpContent} />
    </div>
  );
};

export default ResumeAnalysis;