import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Course } from '../types'
import { DEFAULT_COLOR } from '../utils/constants'
import { getSampleSet, SampleCoursesSetType } from '../mocks/sampleCourses'

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

          return {
            courses: [...state.courses, { ...courseData, isActive: true }],
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

          return {
            courses: [...filteredCourses, updatedCourse],
            selectedCourse:
              state.selectedCourse?.name === oldCourseName
                ? updatedCourse
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
    }
  )
)

export default useCourseStore
