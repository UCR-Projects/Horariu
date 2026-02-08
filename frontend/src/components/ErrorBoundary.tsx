import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { withTranslation, WithTranslation } from 'react-i18next'

interface Props extends WithTranslation<'errors'> {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree
 *
 * Note: Must be a class component because React doesn't provide hooks for error boundaries.
 * Only getDerivedStateFromError and componentDidCatch can catch rendering errors.
 *
 * Features:
 * - Catches errors during rendering, in lifecycle methods, and in constructors
 * - Displays a fallback UI instead of crashing the whole app
 * - Logs error details for debugging
 * - Provides reset functionality to recover from errors
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  /**
   * Update state so the next render will show the fallback UI
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  /**
   * Log error information for debugging
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by ErrorBoundary:', error)
      console.error('Error Info:', errorInfo)
      console.error('Component Stack:', errorInfo.componentStack)
    }

    // Update state with error details
    this.setState({
      errorInfo,
    })

    // TODO: Send to error reporting service in production
    // Example: Sentry
  }

  /**
   * Reset error state and allow user to try again
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })

    // Call custom reset handler if provided
    this.props.onReset?.()
  }

  /**
   * Navigate to home page
   */
  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      const { t } = this.props

      return (
        <div className='min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4'>
          <div className='max-w-md w-full bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 space-y-4'>
            <div className='flex items-center gap-3 text-red-600 dark:text-red-400'>
              <AlertTriangle className='h-8 w-8' />
              <h1 className='text-2xl font-bold'>{t('errorBoundary.title')}</h1>
            </div>

            <div className='space-y-2'>
              <p className='text-neutral-600 dark:text-neutral-300'>
                {t('errorBoundary.description')}
              </p>

              {import.meta.env.DEV && this.state.error && (
                <details className='mt-4 p-3 bg-neutral-100 dark:bg-neutral-900 rounded text-sm'>
                  <summary className='cursor-pointer font-semibold text-neutral-700 dark:text-neutral-300'>
                    {t('errorBoundary.detailsTitle')}
                  </summary>
                  <div className='mt-2 space-y-2'>
                    <p className='text-red-600 dark:text-red-400 font-mono text-xs'>
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className='text-xs overflow-auto max-h-40 text-neutral-600 dark:text-neutral-400'>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
            </div>

            <div className='flex gap-3 pt-2'>
              <Button
                onClick={this.handleReset}
                className='flex-1 flex items-center justify-center gap-2'
                variant='default'
              >
                <RefreshCw className='h-4 w-4' />
                {t('errorBoundary.tryAgain')}
              </Button>
              <Button
                onClick={this.handleGoHome}
                className='flex-1 flex items-center justify-center gap-2'
                variant='outline'
              >
                <Home className='h-4 w-4' />
                {t('errorBoundary.goHome')}
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default withTranslation('errors')(ErrorBoundary)
