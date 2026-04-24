import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ResumeUploadPage from '../../features/resume-upload/pages/ResumeUploadPage.jsx'
import ResumeAnalysisPage from '../../features/resume-analysis/pages/ResumeAnalysisPage.jsx'
import ManualResumeEditorPage from '../../features/manual-resume-editor/pages/ManualResumeEditorPage.jsx'
import FeedbackSummaryPage from '../../features/feedback-summary/pages/FeedbackSummaryPage.jsx'
import NotFound from '../../features/not-found/pages/NotFound.jsx'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ResumeUploadPage />,
      },
      {
        path: 'resume-analysis',
        element: <ResumeAnalysisPage />,
      },
      {
        path: 'manual-resume-editor',
        element: <ManualResumeEditorPage />,
      },
      {
        path: 'feedback-summary',
        element: <FeedbackSummaryPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

const AppRoutes = () => <RouterProvider router={router} />

export default AppRoutes

