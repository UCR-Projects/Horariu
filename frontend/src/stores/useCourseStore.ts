import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Course } from '@/types'
import { getSampleSet, SampleCoursesSetType, sampleLinksForLinked } from '@/mocks/sampleCourses'
import useCourseLinkStore from './useCourseLinkStore'

interface CourseState {
  courses: Course[]
  selectedCourse: Course | null

  setSelectedCourse: (course: Course | null) => void

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

      setSelectedCourse: (course) => set({ selectedCourse: course }),

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

      loadSampleData: (datasetType = 'single') => {
        // Clear existing links first
        useCourseLinkStore.getState().clearAllLinks()

        // Load sample links if using 'linked' dataset
        if (datasetType === 'linked') {
          for (const link of sampleLinksForLinked) {
            useCourseLinkStore.getState().createLinkWithConnections(link.courses, link.connectionSets)
          }
        }

        set({
          courses: getSampleSet(datasetType),
          selectedCourse: null,
        })
      },
    }),
    {
      name: 'course-storage',
      storage: createJSONStorage(() => localStorage),
      version: 5,
      migrate: () => {
        // Fresh start for new version - clear any old data
        return {
          courses: [],
          selectedCourse: null,
        }
      },
    }
  )
)

export default useCourseStore
