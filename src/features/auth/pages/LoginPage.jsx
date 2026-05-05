import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/store/hooks'
import GoogleSignInButton from '../components/GoogleSignInButton'
import EmailAuthForm from '../components/EmailAuthForm'

/**
 * Login Page
 * Clean, minimal login page matching RefineAI design system
 */
function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, status } = useAppSelector((state) => state.auth)

  // Redirect to home if already authenticated
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  // Show loading while checking auth state or redirecting
  if (status === 'loading' && user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome to RefineAI
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to analyze and improve your resume
            </p>
          </div>

          {/* Auth Options */}
          <div className="mt-8 space-y-6 rounded-2xl border bg-card p-8 shadow-sm">
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <GoogleSignInButton />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <EmailAuthForm />
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
