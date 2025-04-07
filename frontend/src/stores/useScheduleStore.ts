import { create } from 'zustand'
import { Day } from '../types'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CourseScheduleItem {
  courseName: string
  color: string
  group: {
    name: string
    schedule: {
      [key in Day]?: {
        start: string
        end: string
      }
    }
  }
}

export interface ScheduleDataType {
  schedules: CourseScheduleItem[][]
}

interface ScheduleState {
  scheduleData: ScheduleDataType | null
  setScheduleData: (data: ScheduleDataType) => void
  clearScheduleData: () => void

  isLoading: boolean
  error: Error | null
  isSuccess: boolean
  setLoading: (loading: boolean) => void
  setSuccess: (success: boolean) => void
  setError: (error: Error | null) => void
  reset: () => void
}

const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      scheduleData: null,
      setScheduleData: (data) => set({ scheduleData: data, isSuccess: true }),
      clearScheduleData: () => set({ scheduleData: null }),

      isLoading: false,
      error: null,
      isSuccess: false,
      setLoading: (loading) => set({ isLoading: loading }),
      setSuccess: (success) => set({ isSuccess: success }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          isLoading: false,
          error: null,
          isSuccess: false,
        }),
    }),
    {
      name: 'schedule-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        scheduleData: state.scheduleData,
      }),
    }
  )
)

export default useScheduleStore
