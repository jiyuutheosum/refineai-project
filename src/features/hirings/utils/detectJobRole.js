/**
 * Detect the user's job role from Groq sectionFeedback
 * Looks at Work Experience and Professional Summary sections
 * Returns a clean job title string for Adzuna search
 */
export function detectJobRole(sectionFeedback = [], overallFeedback = '') {
  if (!sectionFeedback || sectionFeedback.length === 0) return 'software developer'

  // Look for role clues in experience and summary feedback
  const experienceSection = sectionFeedback.find(s =>
    s.section?.toLowerCase().includes('experience')
  )
  const summarySection = sectionFeedback.find(s =>
    s.section?.toLowerCase().includes('summary')
  )

  const combinedText = [
    experienceSection?.feedback || '',
    summarySection?.feedback || '',
    overallFeedback || '',
  ].join(' ').toLowerCase()

  // Common role keywords to detect
  const roleKeywords = [
    { keywords: ['frontend', 'front-end', 'react', 'vue', 'angular', 'ui developer'], role: 'frontend developer' },
    { keywords: ['backend', 'back-end', 'node', 'django', 'laravel', 'api developer'], role: 'backend developer' },
    { keywords: ['fullstack', 'full-stack', 'full stack'], role: 'fullstack developer' },
    { keywords: ['mobile', 'android', 'ios', 'flutter', 'react native'], role: 'mobile developer' },
    { keywords: ['data scientist', 'machine learning', 'deep learning', 'ai engineer'], role: 'data scientist' },
    { keywords: ['data analyst', 'data analysis', 'sql analyst', 'business analyst'], role: 'data analyst' },
    { keywords: ['devops', 'cloud engineer', 'aws', 'kubernetes', 'docker'], role: 'devops engineer' },
    { keywords: ['ui/ux', 'ux designer', 'ui designer', 'product designer', 'figma'], role: 'UI UX designer' },
    { keywords: ['project manager', 'project management', 'scrum master', 'agile'], role: 'project manager' },
    { keywords: ['software engineer', 'software developer', 'programmer'], role: 'software engineer' },
    { keywords: ['web developer', 'web development'], role: 'web developer' },
    { keywords: ['graphic designer', 'graphic design', 'adobe', 'illustrator'], role: 'graphic designer' },
    { keywords: ['accountant', 'accounting', 'bookkeeper', 'cpa'], role: 'accountant' },
    { keywords: ['nurse', 'nursing', 'registered nurse', 'rn'], role: 'nurse' },
    { keywords: ['teacher', 'educator', 'instructor', 'professor'], role: 'teacher' },
    { keywords: ['marketing', 'digital marketing', 'seo', 'social media'], role: 'marketing specialist' },
    { keywords: ['hr', 'human resources', 'recruitment', 'talent acquisition'], role: 'HR specialist' },
    { keywords: ['sales', 'business development', 'account executive'], role: 'sales representative' },
    { keywords: ['ojt', 'internship', 'intern', 'on-the-job'], role: 'intern' },
  ]

  for (const { keywords, role } of roleKeywords) {
    if (keywords.some(kw => combinedText.includes(kw))) {
      return role
    }
  }

  return 'professional'
}