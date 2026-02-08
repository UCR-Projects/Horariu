import { useMutation } from '@tanstack/react-query'
import { generateScheduleService } from '@/services/generateScheduleService'
import { Course } from '@/types'
import { useI18n } from '@/hooks/useI18n'
import { toast } from 'sonner'
import useScheduleStore from '@/stores/useScheduleStore'
import { ApiError, ApiErrorCode } from '@/services/errors'

export const useGenerateSchedule = () => {
  const { setScheduleData, setLoading, setError, reset } = useScheduleStore()
  const { t } = useI18n(['schedules', 'errors'])

  /**
   * Get translated error message based on error type
   */
  const getApiErrorMessage = (error: unknown): string => {
    if (error instanceof ApiError) {
      switch (error.code) {
        case ApiErrorCode.NETWORK:
          return t('errors:api.network')
        case ApiErrorCode.TIMEOUT:
          return t('errors:api.timeout')
        case ApiErrorCode.VALIDATION:
          return t('errors:api.validation')
        case ApiErrorCode.NOT_FOUND:
          return t('errors:api.notFound')
        case ApiErrorCode.SERVER:
          return t('errors:api.server')
        case ApiErrorCode.UNAUTHORIZED:
          return t('errors:api.unauthorized')
        case ApiErrorCode.FORBIDDEN:
          return t('errors:api.forbidden')
        case ApiErrorCode.RATE_LIMIT:
          return t('errors:api.rateLimit')
        default:
          return t('errors:api.unknown')
      }
    }
    return t('errors:api.unknown')
  }

  const mutation = useMutation({
    mutationKey: ['generateSchedule'],
    mutationFn: (courseData: Course[]) =>
      generateScheduleService.generateSchedule(courseData),

    // onMutate: Called before the mutation function is executed.
    // Used for optimistic updates and preparing the mutation environment.
    onMutate: () => {
      reset()
      setLoading(true)
      setError(null)
    },

    onSuccess: (data) => {
      if (data.schedules.length === 0) {
        toast.error(t('schedules:messages.notPossible'))
      } else {
        setScheduleData(data)
        toast.success(t('schedules:messages.success'))
      }
    },

    onError: (error: unknown) => {
      setError(error instanceof Error ? error : new Error('Unknown error'))

      // Get specific error message based on error type
      const errorMessage = getApiErrorMessage(error)
      toast.error(errorMessage)

      // Log detailed error in development
      if (import.meta.env.DEV) {
        console.error('[useGenerateSchedule] Error:', error)
        if (error instanceof ApiError) {
          console.error('  Code:', error.code)
          console.error('  Status:', error.statusCode)
          console.error('  Retryable:', error.isRetryable)
        }
      }
    },

    // onSettled: Called when the mutation is either successful or encounters an error.
    // Used for cleanup operations like turning off loading indicators.
    onSettled: () => {
      setLoading(false)
    },
  })

  return {
    generateSchedule: (courseData: Course[]) => mutation.mutate(courseData),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: () => {
      mutation.reset()
      reset()
    },
  }
}
