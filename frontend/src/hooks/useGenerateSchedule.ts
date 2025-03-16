import { useMutation } from '@tanstack/react-query'
import { generateScheduleService } from '@/services/generateScheduleService'
import useCourseStore from '@/stores/useCourseStore'
import useScheduleStore, { ScheduleData } from '@/stores/useScheduleStore'

export const useGenerateSchedule = () => {
  const { setScheduleData, setLoading, setError, reset } = useScheduleStore()

  const mutation = useMutation<ScheduleData, Error, void>({
    mutationKey: ['generateSchedule'],
    mutationFn: () => {
      const courseData = useCourseStore.getState().courses
      return generateScheduleService.generateSchedule(courseData)
    },
    onMutate: () => {
      setLoading(true)
      setError(null)
    },
    onSuccess: (data) => {
      setScheduleData(data)
    },
    onError: (error) => {
      setError(error)
      console.error(error)
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  return {
    generateSchedule: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    scheduleData: mutation.data,
    isSuccess: mutation.isSuccess,
    reset: () => {
      mutation.reset()
      reset()
    },
  }
}
