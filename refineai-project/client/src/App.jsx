import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/app.css'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'

// Pages
import ResumeUpload from './pages/resume-upload'
import ResumeAnalysis from './pages/resume-analysis'
import ManualResumeEditor from './pages/manual-resume-editor'
import FeedbackSummary from './pages/feedback-summary'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<ResumeUpload />} />
          <Route path="/resume-upload" element={<ResumeUpload />} />
          <Route path="/resume-analysis" element={<ResumeAnalysis />} />
          <Route path="/manual-editor" element={<ManualResumeEditor />} />
          <Route path="/feedback-summary" element={<FeedbackSummary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
