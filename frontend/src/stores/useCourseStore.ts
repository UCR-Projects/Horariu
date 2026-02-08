import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Course, Schedule } from '@/types'
import { DEFAULT_COLOR } from '@/utils/constants'
import { getSampleSet, SampleCoursesSetType } from '@/mocks/sampleCourses'

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
          selectedCourse:
            state.selectedCourse?.name === name ? null : state.selectedCourse,
        })),

      updateCourse: (oldCourseName, updatedCourse) =>
        set((state) => {
          const filteredCourses = state.courses.filter(
            (course) => course.name !== oldCourseName
          )

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
            course.name === courseName
              ? { ...course, isActive: !course.isActive }
              : course
          ),
        })),
      toggleGroupVisibility: (courseName, groupName) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.name === courseName
              ? {
                  ...course,
                  groups: course.groups.map((group) =>
                    group.name === groupName
                      ? { ...group, isActive: !group.isActive }
                      : group
                  ),
                }
              : course
          ),
          selectedCourse:
            state.selectedCourse?.name === courseName
              ? {
                  ...state.selectedCourse,
                  groups: state.selectedCourse.groups.map((group) =>
                    group.name === groupName
                      ? { ...group, isActive: !group.isActive }
                      : group
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
                isActive:
                  course.isActive !== undefined ? course.isActive : true,
                groups:
                  course.groups?.map((group) => ({
                    ...group,
                    isActive:
                      group.isActive !== undefined ? group.isActive : true,
                  })) || [],
              })) || [],
          }
        }
        if (version === 1) {
          const state = persistedState as Partial<CourseState>
          return {
            ...state,
            courses:
              state.courses?.map((course) => ({
                ...course,
                groups:
                  course.groups?.map((group) => ({
                    ...group,
                    // Convert old schedule format to new format
                    schedule: Object.entries(group.schedule || {}).reduce(
                      (acc, [day, timeData]) => {
                        // Check if it's old format (single object) or new format (array)
                        if (Array.isArray(timeData)) {
                          acc[day] = timeData
                        } else {
                          // Old format: convert single time block to array
                          acc[day] = [timeData]
                        }
                        return acc
                      },
                      {} as Schedule
                    ),
                  })) || [],
              })) || [],
          }
        }
        return persistedState as CourseState
      },
      version: 2,
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useCourseStore
