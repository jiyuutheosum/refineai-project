import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
  loginWithEmail,
  registerWithEmailAsync,
  clearError,
} from '../store/authSlice'
import Button from '@/shared/components/ui/Button'
import Input from '@/shared/components/ui/Input'

/**
 * Email/Password Authentication Form
 * Supports both login and registration modes
 */
function EmailAuthForm() {
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.auth)
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  })
  const [validationErrors, setValidationErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }))
    }
    // Clear auth error
    if (error) {
      dispatch(clearError())
    }
  }

  const validateForm = () => {
    const errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (isRegisterMode && !formData.displayName) {
      errors.displayName = 'Name is required for registration'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      if (isRegisterMode) {
        await dispatch(
          registerWithEmailAsync({
            email: formData.email,
            password: formData.password,
            displayName: formData.displayName,
          })
        ).unwrap()
      } else {
        await dispatch(
          loginWithEmail({
            email: formData.email,
            password: formData.password,
          })
        ).unwrap()
      }
    } catch (err) {
      // Error is handled by the slice
    }
  }

  const toggleMode = () => {
    setIsRegisterMode((prev) => !prev)
    setValidationErrors({})
    dispatch(clearError())
  }

  const isLoading = status === 'loading'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isRegisterMode && (
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-foreground"
          >
            Full Name
          </label>
          <Input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleInputChange}
            placeholder="John Doe"
            error={validationErrors.displayName}
            disabled={isLoading}
            className="mt-1"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="you@example.com"
          error={validationErrors.email || (error?.includes('email') ? error : null)}
          disabled={isLoading}
          className="mt-1"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground"
        >
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          error={validationErrors.password || (error?.includes('password') ? error : null)}
          disabled={isLoading}
          className="mt-1"
        />
      </div>

      {error && !Object.keys(validationErrors).length && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
      >
        {isRegisterMode ? 'Create Account' : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isRegisterMode ? (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:underline focus:outline-none"
            >
              Sign In
            </button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:underline focus:outline-none"
            >
              Register
            </button>
          </>
        )}
      </p>
    </form>
  )
}

export default EmailAuthForm
