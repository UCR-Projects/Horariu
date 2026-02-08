import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

/**
 * Component for testing Error Boundary functionality
 * Only visible in development mode
 *
 * This component demonstrates how Error Boundaries catch errors
 * and prevent the entire app from crashing
 */
const ErrorBoundaryTest = () => {
  const [shouldThrow, setShouldThrow] = useState(false)
  const { t } = useTranslation()

  if (shouldThrow) {
    // This will be caught by the nearest Error Boundary
    throw new Error(
      'Test error: This is a simulated error for testing Error Boundary'
    )
  }

  // Only show in development
  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <Button
        onClick={() => setShouldThrow(true)}
        variant='destructive'
        size='sm'
        className='shadow-lg'
      >
        🧪 {t('errorBoundary.testButton')}
      </Button>
    </div>
  )
}

export default ErrorBoundaryTest
