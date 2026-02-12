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

// Legacy types for migration
interface LegacySchedule {
  [key: string]: TimeBlock[]
}

interface LegacyGroup {
  name: string
  schedule: LegacySchedule
}

interface LegacyCourse {
  courseName: string
  color: string
  group: LegacyGroup
}

interface LegacyState {
  scheduleData: {
    schedules: LegacyCourse[][]
  } | null
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
        // v1 -> v2: Convert object schedule format to array format
        if (version < 2) {
          const state = persistedState as LegacyState
          if (state?.scheduleData?.schedules) {
            return {
              ...state,
              scheduleData: {
                schedules: state.scheduleData.schedules.map((schedule: LegacyCourse[]) =>
                  schedule.map((course: LegacyCourse) => ({
                    ...course,
                    group: {
                      ...course.group,
                      schedule: convertLegacyScheduleToArray(course.group.schedule || {}),
                    },
                  }))
                ),
              },
            } as unknown as ScheduleState
          }
        }
        return persistedState as ScheduleState
      },
      partialize: (state) => ({
        scheduleData: state.scheduleData,
      }),
    }
  )
)

export default useScheduleStore
