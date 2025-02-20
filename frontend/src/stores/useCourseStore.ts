// src/stores/useCourseStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Course } from '../types'

interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  currentColor: string;
  
  setSelectedCourse: (course: Course | null) => void;
  setCurrentColor: (color: string) => void;
  addCourse: (name: string) => void;
  deleteCourse: (name: string) => void;
}

const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      courses: [],
      selectedCourse: null,
      currentColor: '#000000',
      
      setSelectedCourse: (course) => set({ selectedCourse: course }),
      setCurrentColor: (color) => set({ currentColor: color }),
      
      addCourse: (name) => set((state) => {
        if (!name.trim()) return state
        
        const newCourse: Course = {
          name,
          color: state.currentColor,
          groups: []
        }
        
        return { 
          courses: [...state.courses, newCourse],
          selectedCourse: newCourse
        }
      }),
      
      deleteCourse: (name) => set((state) => ({
        courses: state.courses.filter(course => course.name !== name),
        selectedCourse: state.selectedCourse?.name === name ? null : state.selectedCourse
      })),
    }),
    {
      name: 'course-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useCourseStore