import { useMutation } from '@tanstack/react-query'
import { generateScheduleService } from '@/services/generateScheduleService'
import useCourseStore from '@/stores/useCourseStore'

export const useGenerateSchedule = () => {
  const mutation = useMutation({
    mutationKey: ['generateSchedule'],
    mutationFn: () => {
      const courseData = useCourseStore.getState().courses
      return generateScheduleService.generateSchedule(courseData)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  return {
    generateSchedule: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    scheduleData: mutation.data,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  }
}
