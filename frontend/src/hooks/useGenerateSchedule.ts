import { useMutation } from '@tanstack/react-query'
import { generateScheduleService } from '@/services/generateScheduleService'
import useScheduleStore from '@/stores/useScheduleStore'
import { Course } from '@/types'

export const useGenerateSchedule = () => {
  const { setScheduleData, setLoading, setError, reset } = useScheduleStore()

  const mutation = useMutation({
    mutationKey: ['generateSchedule'],
    mutationFn: (courseData: Course[]) => {
      return generateScheduleService.generateSchedule(courseData)
    },

    // onMutate: Called before the mutation function is executed.
    // Used for optimistic updates and preparing the mutation environment.
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
