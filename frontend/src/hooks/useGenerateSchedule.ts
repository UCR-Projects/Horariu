import { useMutation } from '@tanstack/react-query'
import { generateScheduleService } from '@/services/generateScheduleService'
import { Course } from '@/types'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import useScheduleStore from '@/stores/useScheduleStore'

export const useGenerateSchedule = () => {
  const { setScheduleData, setLoading, setError, reset } = useScheduleStore()
  const { t } = useTranslation()

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
        toast.error(t('scheduleNotPossible'))
      } else {
        setScheduleData(data)
        toast.success(t('scheduleSuccess'))
      }
    },

    onError: (error) => {
      setError(error)
      toast.error(t('scheduleError'))
      console.error(error)
    },

    // onSettled: Called when the mutation is either successful or encounters an error.
    // Used for cleanup operations like turning off loading indicators.
    onSettled: () => {
      setLoading(false)
    },
  })

  return {
    generateSchedule: (courseData: Course[]) => mutation.mutate(courseData),
    reset: () => {
      mutation.reset()
      reset()
    },
  }
}
