import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Course, DaySchedule, TimeBlock } from '@/types'
import { DEFAULT_COLOR, DAYS } from '@/utils/constants'
import { getSampleSet, SampleCoursesSetType } from '@/mocks/sampleCourses'

// Legacy format for migration from v2
interface LegacySchedule {
  [key: string]: TimeBlock[]
}

/**
 * Converts legacy object schedule format to new array format.
 * Legacy: { L: [{start, end}], M: [{start, end}] }
 * New: [{ day: 'L', active: true, timeBlocks: [{start, end}] }, ...]
 */
function convertLegacyScheduleToArray(schedule: LegacySchedule): DaySchedule[] {
  return DAYS.map((day) => {
    const timeBlocks = schedule[day] || []
    return {
      day,
      active: timeBlocks.length > 0,
      timeBlocks,
    }
  })
}

interface CourseState {
  courses: Course[]
  selectedCourse: Course | null
  currentColor: string

  setSelectedCourse: (course: Course | null) => void
  setCurrentColor: (color: string) => void

  addCourse: (courseData: Course) => void
  deleteCourse: (name: string) => void

  updateCourse: (oldCourseName: string, course: Course) => void

  toggleCourseVisibility: (courseName: string) => void
  toggleGroupVisibility: (courseName: string, groupName: string) => void

  clearAllCourses: () => void

  loadSampleData: (datasetType: SampleCoursesSetType) => void
}

const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      courses: [],
      selectedCourse: null,
      currentColor: DEFAULT_COLOR,

      setSelectedCourse: (course) => set({ selectedCourse: course }),

      setCurrentColor: (color) => set({ currentColor: color }),

      addCourse: (courseData) =>
        set((state) => {
          if (state.courses.some((c) => c.name === courseData.name)) {
            return state
          }

          const courseWithActiveGroups = {
            ...courseData,
            isActive: true,
            groups: courseData.groups.map((group) => ({
              ...group,
              isActive: group.isActive !== undefined ? group.isActive : true,
            })),
          }

          return {
            courses: [...state.courses, courseWithActiveGroups],
          }
        }),

      deleteCourse: (name) =>
        set((state) => ({
          courses: state.courses.filter((course) => course.name !== name),
          selectedCourse: state.selectedCourse?.name === name ? null : state.selectedCourse,
        })),

      updateCourse: (oldCourseName, updatedCourse) =>
        set((state) => {
          const filteredCourses = state.courses.filter((course) => course.name !== oldCourseName)

          const courseWithActiveGroups = {
            ...updatedCourse,
            groups: updatedCourse.groups.map((group) => ({
              ...group,
              isActive: group.isActive !== undefined ? group.isActive : true,
            })),
          }

          return {
            courses: [...filteredCourses, courseWithActiveGroups],
            selectedCourse:
              state.selectedCourse?.name === oldCourseName
                ? courseWithActiveGroups
                : state.selectedCourse,
          }
        }),
      toggleCourseVisibility: (courseName) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.name === courseName ? { ...course, isActive: !course.isActive } : course
          ),
        })),
      toggleGroupVisibility: (courseName, groupName) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.name === courseName
              ? {
                  ...course,
                  groups: course.groups.map((group) =>
                    group.name === groupName ? { ...group, isActive: !group.isActive } : group
                  ),
                }
              : course
          ),
          selectedCourse:
            state.selectedCourse?.name === courseName
              ? {
                  ...state.selectedCourse,
                  groups: state.selectedCourse.groups.map((group) =>
                    group.name === groupName ? { ...group, isActive: !group.isActive } : group
                  ),
                }
              : state.selectedCourse,
        })),

      clearAllCourses: () =>
        set({
          courses: [],
          selectedCourse: null,
        }),

      loadSampleData: (datasetType = 'single') =>
        set({
          courses: getSampleSet(datasetType),
          selectedCourse: null,
        }),
    }),
    {
      name: 'course-storage',
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          const state = persistedState as Partial<CourseState>
          return {
            ...state,
            courses:
              state.courses?.map((course) => ({
                ...course,
                isActive: course.isActive !== undefined ? course.isActive : true,
                groups:
                  course.groups?.map((group) => ({
                    ...group,
                    isActive: group.isActive !== undefined ? group.isActive : true,
                  })) || [],
              })) || [],
          }
        }
        // v1 -> v2: Convert single time blocks to arrays (legacy object format)
        if (version === 1) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const state = persistedState as any
          return {
            ...state,
            courses:
              state.courses?.map((course: any) => ({
                ...course,
                groups:
                  course.groups?.map((group: any) => ({
                    ...group,
                    schedule: Object.entries(group.schedule || {}).reduce(
                      (acc: LegacySchedule, [day, timeData]: [string, any]) => {
                        if (Array.isArray(timeData)) {
                          acc[day] = timeData
                        } else {
                          acc[day] = [timeData]
                        }
                        return acc
                      },
                      {} as LegacySchedule
                    ),
                  })) || [],
              })) || [],
          }
        }
        // v2 -> v3: Convert object schedule format to array format
        if (version === 2) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const state = persistedState as any
          return {
            ...state,
            courses:
              state.courses?.map((course: any) => ({
                ...course,
                groups:
                  course.groups?.map((group: any) => ({
                    ...group,
                    schedule: convertLegacyScheduleToArray(group.schedule || {}),
                  })) || [],
              })) || [],
          }
        }
        return persistedState as CourseState
      },
      version: 3,
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useCourseStore
