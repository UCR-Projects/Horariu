import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Course, DaySchedule, TimeBlock } from '@/types'
import { DEFAULT_COLOR, DAYS } from '@/utils/constants'
import { getSampleSet, SampleCoursesSetType } from '@/mocks/sampleCourses'

// Legacy types for migration (v2 -> v3: object to array format)
interface LegacySchedule {
  [key: string]: TimeBlock[]
}

interface LegacyGroup {
  name: string
  schedule: LegacySchedule
  isActive?: boolean
}

interface LegacyCourse {
  name: string
  color: string
  groups: LegacyGroup[]
  isActive?: boolean
}

interface LegacyState {
  courses: LegacyCourse[]
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
      storage: createJSONStorage(() => localStorage),
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        // v2 -> v3: Convert object schedule format to array format
        if (version < 3) {
          const state = persistedState as LegacyState
          return {
            ...state,
            courses:
              state.courses?.map((course: LegacyCourse) => ({
                ...course,
                groups:
                  course.groups?.map((group: LegacyGroup) => ({
                    ...group,
                    schedule: convertLegacyScheduleToArray(group.schedule || {}),
                  })) || [],
              })) || [],
          } as unknown as CourseState
        }
        return persistedState as CourseState
      },
    }
  )
)

export default useCourseStore
