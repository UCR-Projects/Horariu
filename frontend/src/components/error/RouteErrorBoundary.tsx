import { useRouteError, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'

/**
 * Error Boundary component specifically for React Router errors
 *
 * This component handles errors that occur during:
 * - Route rendering
 * - Data loading (loaders)
 * - Data mutations (actions)
 */
const RouteErrorBoundary = () => {
  const error = useRouteError() as Error
  const navigate = useNavigate()
  const { t } = useI18n('errors')

  const handleReset = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    navigate('/')
  }

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

          {import.meta.env.DEV && error && (
            <details className='mt-4 p-3 bg-neutral-100 dark:bg-neutral-900 rounded text-sm'>
              <summary className='cursor-pointer font-semibold text-neutral-700 dark:text-neutral-300'>
                {t('errorBoundary.detailsTitle')}
              </summary>
              <div className='mt-2 space-y-2'>
                <p className='text-red-600 dark:text-red-400 font-mono text-xs'>
                  {error.toString()}
                </p>
                {error.stack && (
                  <pre className='text-xs overflow-auto max-h-40 text-neutral-600 dark:text-neutral-400'>
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}
        </div>

        <div className='flex gap-3 pt-2'>
          <Button
            onClick={handleReset}
            className='flex-1 flex items-center justify-center gap-2'
            variant='default'
          >
            <RefreshCw className='h-4 w-4' />
            {t('errorBoundary.tryAgain')}
          </Button>
          <Button
            onClick={handleGoHome}
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

export default RouteErrorBoundary
