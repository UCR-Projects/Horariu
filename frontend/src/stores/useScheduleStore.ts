import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Schedule, DaySchedule, TimeBlock, Day } from '@/types'
import { DAYS } from '@/utils/constants'

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

// Legacy format for migration
interface LegacySchedule {
  [key: string]: TimeBlock[]
}

/**
 * Converts legacy object schedule format to new array format.
 */
function convertLegacyScheduleToArray(schedule: LegacySchedule): DaySchedule[] {
  return DAYS.map((day: Day): DaySchedule => {
    const timeBlocks = schedule[day] || []
    return {
      day,
      active: timeBlocks.length > 0,
      timeBlocks,
    }
  })
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
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let state = persistedState as any

        // v0 -> v1: Convert single time blocks to arrays
        if (version === 0 && state && typeof state === 'object') {
          if (state.scheduleData?.schedules) {
            state.scheduleData.schedules = state.scheduleData.schedules.map((schedule: any) => {
              if (Array.isArray(schedule)) {
                return schedule.map((course: any) => {
                  if (course && typeof course === 'object') {
                    return {
                      ...course,
                      group: course.group
                        ? {
                            ...course.group,
                            schedule: Object.fromEntries(
                              Object.entries(course.group.schedule || {}).map(
                                ([day, timeBlock]) => [day, [timeBlock]]
                              )
                            ),
                          }
                        : undefined,
                    }
                  }
                  return course
                })
              }
              return schedule
            })
          }
          version = 1 // Mark as migrated to v1
        }

        // v1 -> v2: Convert object schedule format to array format
        if (version === 1 && state && typeof state === 'object') {
          if (state.scheduleData?.schedules) {
            state.scheduleData.schedules = state.scheduleData.schedules.map((schedule: any) => {
              if (Array.isArray(schedule)) {
                return schedule.map((course: any) => {
                  if (course && typeof course === 'object' && course.group) {
                    return {
                      ...course,
                      group: {
                        ...course.group,
                        schedule: convertLegacyScheduleToArray(course.group.schedule || {}),
                      },
                    }
                  }
                  return course
                })
              }
              return schedule
            })
          }
        }

        return state
      },
      partialize: (state) => ({
        scheduleData: state.scheduleData,
      }),
    }
  )
)

export default useScheduleStore
