import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Schedule } from '@/types'

export interface StoredGroup {
  name: string
  schedule: Schedule
}

export interface StoredCourse {
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
  updateCourseName: (oldName: string, newName: string) => void
  updateGroupName: (courseName: string, oldGroupName: string, newGroupName: string) => void

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
      updateCourseName: (oldName, newName) =>
        set((state) => {
          if (!state.scheduleData?.schedules) return state
          return {
            scheduleData: {
              schedules: state.scheduleData.schedules.map((schedule) =>
                schedule.map((course) =>
                  course.courseName === oldName
                    ? { ...course, courseName: newName }
                    : course
                )
              ),
            },
          }
        }),
      updateGroupName: (courseName, oldGroupName, newGroupName) =>
        set((state) => {
          if (!state.scheduleData?.schedules) return state
          return {
            scheduleData: {
              schedules: state.scheduleData.schedules.map((schedule) =>
                schedule.map((course) =>
                  course.courseName === courseName && course.group.name === oldGroupName
                    ? { ...course, group: { ...course.group, name: newGroupName } }
                    : course
                )
              ),
            },
          }
        }),

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
      version: 3,
      migrate: () => {
        // Fresh start for new version - clear any old data
        return {
          scheduleData: null,
          isLoading: false,
          error: null,
          isSuccess: false,
        }
      },
      partialize: (state) => ({
        scheduleData: state.scheduleData,
      }),
    }
  )
)

export default useScheduleStore
