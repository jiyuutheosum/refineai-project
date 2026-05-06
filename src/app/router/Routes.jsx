import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ErrorBoundary from '../../shared/components/ErrorBoundary'
import AuthGuard from '../../features/auth/components/AuthGuard'

const ResumeUploadPage = lazy(() => import('../../features/resume-upload/pages/ResumeUploadPage'))
const ResumeAnalysisPage = lazy(() => import('../../features/resume-analysis/pages/ResumeAnalysisPage'))
const ManualResumeEditorPage = lazy(() => import('../../features/manual-resume-editor/pages/ManualResumeEditorPage'))
const FeedbackSummaryPage = lazy(() => import('../../features/feedback-summary/pages/FeedbackSummaryPage'))
const HiringsPage = lazy(() => import('../../features/hirings/pages/HiringsPage'))
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

const ProtectedRoute = ({ children }) => (
  <AuthGuard>{children}</AuthGuard>
)

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
        element: <ProtectedRoute>{withSuspense(ResumeAnalysisPage)}</ProtectedRoute>,
      },
      {
        path: 'manual-resume-editor',
        element: <ProtectedRoute>{withSuspense(ManualResumeEditorPage)}</ProtectedRoute>,
      },
      {
        path: 'feedback-summary',
        element: <ProtectedRoute>{withSuspense(FeedbackSummaryPage)}</ProtectedRoute>,
      },
      {
        path: 'hirings',
        element: <ProtectedRoute>{withSuspense(HiringsPage)}</ProtectedRoute>,
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