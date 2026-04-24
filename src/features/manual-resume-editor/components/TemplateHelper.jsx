import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TemplateHelper = ({ section, onInsertTemplate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates = {
    'Education': [
      {
        title: 'Bachelor\'s Degree',
        content: `Bachelor of Science in Computer Science\nUniversity Name, City, State\nGraduation: May 2025\nGPA: 3.8/4.0\n\nRelevant Coursework: Data Structures, Algorithms, Database Systems, Web Development`
      },
      {
        title: 'Master\'s Degree',
        content: `Master of Science in Software Engineering\nUniversity Name, City, State\nGraduation: Expected May 2026\nGPA: 3.9/4.0\n\nThesis: Advanced Machine Learning Applications in Healthcare`
      }
    ],
    'Skills': [
      {
        title: 'Technical Skills',
        content: `Programming Languages: Python, JavaScript, Java, C++\nWeb Technologies: React, Node.js, HTML5, CSS3\nDatabases: MySQL, MongoDB, PostgreSQL\nTools & Platforms: Git, Docker, AWS, VS Code`
      },
      {
        title: 'Soft Skills',
        content: `Communication: Strong written and verbal communication skills\nTeamwork: Collaborative team player with leadership experience\nProblem-Solving: Analytical thinker with creative solution approach\nTime Management: Efficient multitasker meeting tight deadlines`
      }
    ],
    'Experience': [
      {
        title: 'Software Intern',
        content: `Software Development Intern\nCompany Name, City, State\nJune 2025 - August 2025\n\n• Developed and maintained web applications using React and Node.js\n• Collaborated with cross-functional teams to deliver features on schedule\n• Implemented automated testing reducing bugs by 30%\n• Participated in code reviews and agile development processes`
      },
      {
        title: 'Research Assistant',
        content: `Research Assistant\nUniversity Department, City, State\nSeptember 2024 - Present\n\n• Conducted research on machine learning algorithms for data analysis\n• Published findings in peer-reviewed conference proceedings\n• Mentored 3 undergraduate students in research methodologies\n• Presented research at national academic conference`
      }
    ],
    'Projects': [
      {
        title: 'Web Application',
        content: `E-Commerce Platform\nJanuary 2025 - March 2025\n\n• Built full-stack e-commerce application using MERN stack\n• Implemented secure payment processing with Stripe API\n• Designed responsive UI serving 1000+ daily active users\n• Deployed on AWS with 99.9% uptime\n\nTechnologies: React, Node.js, MongoDB, Express, AWS`
      },
      {
        title: 'Mobile App',
        content: `Fitness Tracking Mobile App\nSeptember 2024 - December 2024\n\n• Developed cross-platform mobile app using React Native\n• Integrated health data APIs for activity tracking\n• Achieved 4.5-star rating with 500+ downloads\n• Implemented push notifications increasing user engagement by 40%\n\nTechnologies: React Native, Firebase, Redux, REST APIs`
      }
    ],
    'Certifications': [
      {
        title: 'Professional Certification',
        content: `AWS Certified Solutions Architect - Associate\nAmazon Web Services\nIssued: January 2025\nCredential ID: ABC123XYZ\n\nValidates expertise in designing distributed systems on AWS platform`
      },
      {
        title: 'Course Completion',
        content: `Full Stack Web Development Specialization\nCoursera - University Partner\nCompleted: December 2024\n\nComprehensive program covering HTML, CSS, JavaScript, React, Node.js, and MongoDB`
      }
    ]
  };

  const sectionTemplates = templates?.[section] || [];

  if (sectionTemplates?.length === 0) return null;

  return (
    <div className="mb-4">
      <Button
        variant="outline"
        size="sm"
        iconName="FileText"
        iconPosition="left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Hide' : 'Show'} Templates & Examples
      </Button>
      {isOpen && (
        <div className="mt-3 p-4 bg-muted/30 border border-border rounded-lg space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Lightbulb" size={16} className="text-primary" />
            <p className="text-sm font-medium text-foreground">Choose a template to get started</p>
          </div>

          {sectionTemplates?.map((template, index) => (
            <div key={index} className="p-3 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-foreground">{template?.title}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Plus"
                  onClick={() => {
                    onInsertTemplate(template?.content);
                    setIsOpen(false);
                  }}
                  className="h-7"
                >
                  Use
                </Button>
              </div>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-4">
                {template?.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateHelper;