import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/shared/components/ui/Button'
import Icon from '@/shared/components/AppIcon'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md text-center">
        <h1 className="mb-6 text-9xl font-bold text-primary opacity-20">
          404
        </h1>

        <h2 className="mb-2 text-2xl font-medium text-foreground">
          Page Not Found
        </h2>

        <p className="mb-8 text-muted-foreground">
          The page you're looking for doesn't exist. Let's get you back!
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            variant="default"
            icon={<Icon name="ArrowLeft" size={16} />}
            iconPosition="left"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>

          <Button
            variant="outline"
            icon={<Icon name="Home" size={16} />}
            iconPosition="left"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound