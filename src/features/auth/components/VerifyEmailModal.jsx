import { useState } from 'react'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Button from '@/shared/components/ui/Button'
import Icon from '@/shared/components/AppIcon'

/**
 * Modal shown to users who registered with email/password
 * but have not yet verified their email.
 */
function VerifyEmailModal({ isOpen, onClose, userEmail }) {
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'success' | 'error', text: string }

  if (!isOpen) return null

  const handleResendVerification = async () => {
    setIsSending(true)
    setMessage(null)

    try {
      const currentUser = auth.currentUser
      if (currentUser) {
        await sendEmailVerification(currentUser)
        setMessage({
          type: 'success',
          text: 'Verification email sent! Please check your inbox (and spam folder).',
        })
      }
    } catch (error) {
      console.error('Error sending verification email:', error)
      setMessage({
        type: 'error',
        text: 'Failed to send verification email. Please try again later.',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Icon name="Mail" size={24} className="text-primary" />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">
              Verify Your Email
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              To use AI features (Resume Analysis, Mock Interviews, etc.), you need to verify your email address.
            </p>

            {userEmail && (
              <p className="mt-3 text-sm font-medium text-foreground">
                Verification email sent to: <span className="text-primary">{userEmail}</span>
              </p>
            )}

            {message && (
              <div
                className={`mt-4 rounded-lg p-3 text-sm ${
                  message.type === 'success'
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <Button
                onClick={handleResendVerification}
                disabled={isSending}
                loading={isSending}
                fullWidth
              >
                {isSending ? 'Sending...' : 'Resend Verification Email'}
              </Button>

              <Button
                variant="outline"
                onClick={onClose}
                fullWidth
              >
                Maybe Later
              </Button>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailModal
