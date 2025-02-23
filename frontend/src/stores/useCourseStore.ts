import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Course, Group } from '../types'

interface CourseState {
  courses: Course[]
  selectedCourse: Course | null
  currentColor: string
  selectedGroup: Group | null
  selectedDays: string[]

  setSelectedCourse: (course: Course | null) => void
  setCurrentColor: (color: string) => void
  setSelectedGroup: (group: Group | null) => void

  addCourse: (name: string) => void
  deleteCourse: (name: string) => void

  addGroup: (courseName: string) => void
  deleteGroup: (courseName: string, groupName: string) => void

  toggleDay: (day: string) => void
  updateSchedule: (
    groupName: string,
    day: string,
    start: string,
    end: string
  ) => void
}

const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      courses: [],
      selectedCourse: null,
      currentColor: '#000000',
      selectedGroup: null,
      selectedDays: [],

      setSelectedCourse: (course) =>
        set({ selectedCourse: course, selectedGroup: null, selectedDays: [] }),

      setCurrentColor: (color) => set({ currentColor: color }),

      setSelectedGroup: (group) => set({ selectedGroup: group }),

      addCourse: (name) =>
        set((state) => {
          if (!name.trim()) return state

          const newCourse: Course = {
            name,
            color: state.currentColor,
            groups: [],
          }

          return {
            courses: [...state.courses, newCourse],
            selectedCourse: newCourse,
          }
        }),

      deleteCourse: (name) =>
        set((state) => ({
          courses: state.courses.filter((course) => course.name !== name),
          selectedCourse:
            state.selectedCourse?.name === name ? null : state.selectedCourse,
        })),

      addGroup: (courseName) =>
        set((state) => {
          const course = state.courses.find(
            (course) => course.name === courseName
          )
          if (!course) return state

          const newGroup: Group = {
            name: `${String(course.groups.length + 1).padStart(2, '0')}`,
            schedule: {},
          }

          const updatedCourse = {
            ...course,
            groups: [...course.groups, newGroup],
          }

          const newCourses = [
            ...state.courses.filter((course) => course.name !== courseName),
            updatedCourse,
          ]

          return {
            courses: newCourses,
            selectedCourse:
              state.selectedCourse?.name === courseName
                ? updatedCourse
                : state.selectedCourse,
          }
        }),

      deleteGroup: (courseName, groupName) =>
        set((state) => {
          const course = state.courses.find(
            (course) => course.name === courseName
          )

          if (!course) return state

          const updatedGroups = course.groups.filter(
            (group) => group.name !== groupName
          )

          const updatedCourse = {
            ...course,
            groups: updatedGroups,
          }

          const newCourses = [
            ...state.courses.filter((course) => course.name !== courseName),
            updatedCourse,
          ]

          return {
            courses: newCourses,
            selectedCourse:
              state.selectedCourse?.name === courseName
                ? updatedCourse
                : state.selectedCourse,
          }
        }),

      toggleDay: (day) =>
        set((state) => ({
          selectedDays: state.selectedDays.includes(day)
            ? state.selectedDays.filter((d) => d !== day)
            : [...state.selectedDays, day],
        })),

      updateSchedule: (groupName, day, start, end) =>
        set((state) => {
          if (!state.selectedCourse) return state

          const course = state.selectedCourse
          const group = course.groups.find((group) => group.name === groupName)
          if (!group) return state

          const updatedGroup = {
            ...group,
            schedule: {
              ...group.schedule,
              [day]: {
                start,
                end,
              },
            },
          }

          const updatedGroups = course.groups.map((group) =>
            group.name === groupName ? updatedGroup : group
          )

          const updatedCourse = {
            ...course,
            groups: updatedGroups,
          }

          const newCourses = [
            ...state.courses.filter((course) => course.name !== course.name),
            updatedCourse,
          ]
          return {
            courses: newCourses,
            selectedCourse: updatedCourse,
          }
        }),
    }),
    {
      name: 'course-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useCourseStore
