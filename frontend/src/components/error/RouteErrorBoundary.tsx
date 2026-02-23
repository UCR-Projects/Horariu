import { useRouteError, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'
import { tokens } from '@/styles'

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
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='max-w-md w-full bg-card rounded-lg shadow-lg p-6 space-y-4'>
        <div className='flex items-center gap-3 text-red-600 dark:text-red-400'>
          <AlertTriangle className={tokens.icon.xl} />
          <h1 className='text-2xl font-bold'>{t('errorBoundary.title')}</h1>
        </div>

        <div className='space-y-2'>
          <p className='text-muted-foreground'>
            {t('errorBoundary.description')}
          </p>

          {import.meta.env.DEV && error && (
            <details className='mt-4 p-3 bg-muted rounded text-sm'>
              <summary className='cursor-pointer font-semibold text-foreground'>
                {t('errorBoundary.detailsTitle')}
              </summary>
              <div className='mt-2 space-y-2'>
                <p className='text-red-600 dark:text-red-400 font-mono text-xs'>
                  {error.toString()}
                </p>
                {error.stack && (
                  <pre className='text-xs overflow-auto max-h-40 text-muted-foreground'>
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
            <RefreshCw className={tokens.icon.sm} />
            {t('errorBoundary.tryAgain')}
          </Button>
          <Button
            onClick={handleGoHome}
            className='flex-1 flex items-center justify-center gap-2'
            variant='outline'
          >
            <Home className={tokens.icon.sm} />
            {t('errorBoundary.goHome')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RouteErrorBoundary
