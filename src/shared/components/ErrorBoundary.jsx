import React from 'react'
import Icon from '@/shared/components/AppIcon'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Error caught by ErrorBoundary:', error, errorInfo)
    }

    window.__COMPONENT_ERROR__?.(error, errorInfo)
  }

  handleGoBack = () => {
    window.history.length > 1 ? window.history.back() : window.location.assign('/')
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <section className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Icon name="TriangleAlert" size={28} className="text-red-500" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-neutral-900">
            Something went wrong
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-600">
            We encountered an unexpected error while processing your request.
            You can go back or reload the page.
          </p>

          {import.meta.env.DEV && this.state.error?.message && (
            <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-neutral-100 p-3 text-left text-xs text-neutral-700">
              {this.state.error.message}
            </pre>
          )}

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleGoBack}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
            >
              <Icon name="ArrowLeft" size={18} />
              Back
            </button>

            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              <Icon name="RefreshCcw" size={18} />
              Reload
            </button>
          </div>
        </section>
      </main>
    )
  }
}

export default ErrorBoundary