import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
} from 'react-router-dom'
import { useAppSelector } from '@/app/store/hooks'
import MainLayout from '../layouts/MainLayout'
import ErrorBoundary from '../../shared/components/ErrorBoundary'
import AuthGuard from '../../features/auth/components/AuthGuard'

const ResumeUploadPage = lazy(() =>
  import('../../features/resume-upload/pages/ResumeUploadPage')
)
const ResumeAnalysisPage = lazy(() =>
  import('../../features/resume-analysis/pages/ResumeAnalysisPage')
)
const ManualResumeEditorPage = lazy(() =>
  import('../../features/manual-resume-editor/pages/ManualResumeEditorPage')
)
const FeedbackSummaryPage = lazy(() =>
  import('../../features/feedback-summary/pages/FeedbackSummaryPage')
)
const HiringsPage = lazy(() => import('../../features/hirings/pages/HiringsPage'))
const MyResumesPage = lazy(() =>
  import('../../features/my-resumes/pages/MyResumesPage')
)
const ResumeDetailPage = lazy(() =>
  import('../../features/my-resumes/pages/ResumeDetailPage')
)
const NotFound = lazy(() => import('../../features/not-found/pages/NotFound'))
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'))

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <p className="text-sm text-muted-foreground">Loading page...</p>
  </div>
)

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

const ProtectedRoute = ({ children }) => {
  return <AuthGuard>{children}</AuthGuard>
}

const WorkflowGuard = ({ step, children }) => {
  const location = useLocation()

  const { currentResume } = useAppSelector((state) => state.resumeUpload)
  const {
    overallScore,
    overallFeedback,
    sectionFeedback,
    status: analysisStatus,
  } = useAppSelector((state) => state.analysis)

  const routeScore = location.state?.score || 0
  const effectiveScore = overallScore || routeScore || 0

  const hasResume = Boolean(currentResume)
  const hasAnalysis =
    effectiveScore > 0 ||
    Boolean(overallFeedback) ||
    sectionFeedback?.length > 0 ||
    analysisStatus === 'succeeded'

  if (step === 'analysis' && !hasResume && !hasAnalysis) {
    return <Navigate to="/" replace />
  }

  if (step === 'editor' && !hasAnalysis) {
    return <Navigate to="/" replace />
  }

  if (step === 'summary' && !hasAnalysis) {
    return <Navigate to="/" replace />
  }

  if (step === 'hirings' && effectiveScore < 80) {
    return <Navigate to="/feedback-summary" replace />
  }

  return children
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <ProtectedRoute>{withSuspense(ResumeUploadPage)}</ProtectedRoute>,
      },
      {
        path: 'resume-upload',
        element: <Navigate to="/" replace />,
      },
      {
        path: 'resume-analysis',
        element: (
          <ProtectedRoute>
            <WorkflowGuard step="analysis">
              {withSuspense(ResumeAnalysisPage)}
            </WorkflowGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'manual-resume-editor',
        element: (
          <ProtectedRoute>
            <WorkflowGuard step="editor">
              {withSuspense(ManualResumeEditorPage)}
            </WorkflowGuard>
          </ProtectedRoute>
        ),
      },
      {
        // Bypasses WorkflowGuard — data comes from state.myResumes, not state.analysis
        path: 'my-resumes/:resumeId/edit',
        element: (
          <ProtectedRoute>{withSuspense(ManualResumeEditorPage)}</ProtectedRoute>
        ),
      },
      {
        path: 'feedback-summary',
        element: (
          <ProtectedRoute>
            <WorkflowGuard step="summary">
              {withSuspense(FeedbackSummaryPage)}
            </WorkflowGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'hirings',
        element: (
          <ProtectedRoute>
            <WorkflowGuard step="hirings">
              {withSuspense(HiringsPage)}
            </WorkflowGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-resumes',
        element: <ProtectedRoute>{withSuspense(MyResumesPage)}</ProtectedRoute>,
      },
      {
        path: 'my-resumes/:resumeId',
        element: <ProtectedRoute>{withSuspense(ResumeDetailPage)}</ProtectedRoute>,
      },
      {
        path: 'login',
        element: withSuspense(LoginPage),
      },
      {
        path: '*',
        element: withSuspense(NotFound),
      },
    ],
  },
])

const AppRoutes = () => <RouterProvider router={router} />

export default AppRoutes