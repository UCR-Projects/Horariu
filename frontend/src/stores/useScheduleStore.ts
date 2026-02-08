import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Schedule } from '@/types'

interface StoredGroup {
  name: string
  schedule: Schedule
}

interface StoredCourse {
  courseName: string
  color: string
  group: StoredGroup
}

export interface ScheduleDataType {
  schedules: StoredCourse[][]
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
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (
          version === 0 &&
          persistedState &&
          typeof persistedState === 'object'
        ) {
          const state = persistedState as {
            scheduleData?: { schedules?: unknown[][] }
          }

          if (state.scheduleData?.schedules) {
            state.scheduleData.schedules = state.scheduleData.schedules.map(
              (schedule: unknown) => {
                if (Array.isArray(schedule)) {
                  return schedule.map((course: unknown) => {
                    if (course && typeof course === 'object') {
                      const typedCourse = course as {
                        group?: {
                          schedule?: Record<
                            string,
                            { start: string; end: string }
                          >
                        }
                      }

                      return {
                        ...typedCourse,
                        group: typedCourse.group
                          ? {
                              ...typedCourse.group,
                              schedule: Object.fromEntries(
                                Object.entries(
                                  typedCourse.group.schedule || {}
                                ).map(([day, timeBlock]) => [day, [timeBlock]])
                              ),
                            }
                          : undefined,
                      }
                    }
                    return course
                  })
                }
                return schedule
              }
            ) as unknown[][]
          }
        }
        return persistedState
      },
      partialize: (state) => ({
        scheduleData: state.scheduleData,
      }),
    }
  )
)

export default useScheduleStore
