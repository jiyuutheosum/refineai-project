import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { loginWithGoogle } from '../store/authSlice'
import Button from '@/shared/components/ui/Button'

/**
 * Google Sign-In Button component
 */
function GoogleSignInButton() {
  const dispatch = useAppDispatch()
  const { status } = useAppSelector((state) => state.auth)

  const handleGoogleSignIn = async () => {
    try {
      await dispatch(loginWithGoogle()).unwrap()
    } catch (error) {
      // Error is handled by the slice
    }
  }

  const isLoading = status === 'loading'

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      fullWidth
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      loading={isLoading}
      iconName="Chrome"
      iconPosition="left"
      className="border-input bg-background hover:bg-accent hover:text-accent-foreground"
    >
      Continue with Google
    </Button>
  )
}

export default GoogleSignInButton
