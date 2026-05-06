import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { logout } from '@/features/auth/store/authSlice'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Icon from '@/shared/components/AppIcon'
import Button from '@/shared/components/ui/Button'

function Header() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })
  const dropdownRef = useRef(null)
  const { user, isAuthenticated } = useAuth()
  const authState = useAppSelector((state) => state.auth)

  // Handle theme toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      navigate('/login')
    } catch (error) {
      // Error handled by slice
    }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.split(' ')
    return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => isAuthenticated ? navigate('/') : navigate('/')}
          className="flex items-center gap-3 rounded-lg text-foreground transition hover:opacity-80"
          aria-label="Go to upload page"
        >
          <span className="text-xl font-bold tracking-tight">
            RefineAI
          </span>
        </button>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-accent"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Icon name={isDarkMode ? 'Sun' : 'Moon'} size={20} />
          </button>

          {!isAuthenticated ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-accent"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {getInitials(user?.displayName)}
                  </div>
                )}
                <span className="text-sm font-medium text-foreground hidden md:block">
                  {user?.displayName?.split(' ')[0]}
                </span>
                <Icon
                  name={isDropdownOpen ? 'ChevronUp' : 'ChevronDown'}
                  size={16}
                  className="text-muted-foreground"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-background py-1 shadow-md">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false)
                      navigate('/')
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                  >
                    <Icon name="FileText" size={16} />
                    My Resumes
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                  >
                    <Icon name="LogOut" size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
