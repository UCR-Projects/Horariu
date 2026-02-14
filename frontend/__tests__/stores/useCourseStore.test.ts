import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import useCourseStore from '@/stores/useCourseStore'
import { Course, Day } from '@/types'
import { DEFAULT_COLOR, DAYS } from '@/utils/constants'

function createTestCourse(name: string, color = DEFAULT_COLOR): Course {
  return {
    name,
    color,
    isActive: true,
    groups: [
      {
        name: 'Group 1',
        isActive: true,
        schedule: DAYS.map((day: Day) => ({
          day,
          active: day === 'L',
          timeBlocks: day === 'L' ? [{ start: '08:00', end: '09:30' }] : [],
        })),
      },
    ],
  }
}

describe('useCourseStore', () => {
  beforeEach(() => {
    act(() => {
      useCourseStore.setState({
        courses: [],
        selectedCourse: null,
        currentColor: DEFAULT_COLOR,
      })
    })
  })

  describe('addCourse', () => {
    it('should add a new course', () => {
      const course = createTestCourse('Math 101')
      act(() => {
        useCourseStore.getState().addCourse(course)
      })
      const state = useCourseStore.getState()
      expect(state.courses).toHaveLength(1)
      expect(state.courses[0].name).toBe('Math 101')
    })

    it('should not add duplicate course with same name', () => {
      const course1 = createTestCourse('Math 101')
      const course2 = createTestCourse('Math 101', 'bg-blue-500')
      act(() => {
        useCourseStore.getState().addCourse(course1)
        useCourseStore.getState().addCourse(course2)
      })
      const state = useCourseStore.getState()
      expect(state.courses).toHaveLength(1)
      expect(state.courses[0].color).toBe(DEFAULT_COLOR)
    })

    it('should set isActive to true for new courses', () => {
      const course = { ...createTestCourse('Math 101'), isActive: false }
      act(() => {
        useCourseStore.getState().addCourse(course)
      })
      expect(useCourseStore.getState().courses[0].isActive).toBe(true)
    })
  })

  describe('deleteCourse', () => {
    it('should delete a course by name', () => {
      const course = createTestCourse('Math 101')
      act(() => {
        useCourseStore.getState().addCourse(course)
        useCourseStore.getState().deleteCourse('Math 101')
      })
      expect(useCourseStore.getState().courses).toHaveLength(0)
    })

    it('should clear selectedCourse when deleted course was selected', () => {
      const course = createTestCourse('Math 101')
      act(() => {
        useCourseStore.getState().addCourse(course)
        useCourseStore.getState().setSelectedCourse(course)
        useCourseStore.getState().deleteCourse('Math 101')
      })
      expect(useCourseStore.getState().selectedCourse).toBeNull()
    })
  })

  describe('updateCourse', () => {
    it('should update an existing course', () => {
      const course = createTestCourse('Math 101')
      const updatedCourse = { ...course, name: 'Math 102', color: 'bg-blue-500' }
      act(() => {
        useCourseStore.getState().addCourse(course)
        useCourseStore.getState().updateCourse('Math 101', updatedCourse)
      })
      const state = useCourseStore.getState()
      expect(state.courses).toHaveLength(1)
      expect(state.courses[0].name).toBe('Math 102')
    })

    it('should update selectedCourse when updated course was selected', () => {
      const course = createTestCourse('Math 101')
      const updatedCourse = { ...course, name: 'Math 102' }
      act(() => {
        useCourseStore.getState().addCourse(course)
        useCourseStore.getState().setSelectedCourse(course)
        useCourseStore.getState().updateCourse('Math 101', updatedCourse)
      })
      expect(useCourseStore.getState().selectedCourse?.name).toBe('Math 102')
    })
  })

  describe('toggleCourseVisibility', () => {
    it('should toggle course isActive state', () => {
      const course = createTestCourse('Math 101')
      act(() => {
        useCourseStore.getState().addCourse(course)
        useCourseStore.getState().toggleCourseVisibility('Math 101')
      })
      expect(useCourseStore.getState().courses[0].isActive).toBe(false)
    })
  })

  describe('toggleGroupVisibility', () => {
    it('should toggle group isActive state', () => {
      const course = createTestCourse('Math 101')
      act(() => {
        useCourseStore.getState().addCourse(course)
        useCourseStore.getState().toggleGroupVisibility('Math 101', 'Group 1')
      })
      expect(useCourseStore.getState().courses[0].groups[0].isActive).toBe(false)
    })
  })

  describe('clearAllCourses', () => {
    it('should remove all courses and clear selected course', () => {
      act(() => {
        useCourseStore.getState().addCourse(createTestCourse('Math 101'))
        useCourseStore.getState().addCourse(createTestCourse('Physics 201'))
        useCourseStore.getState().clearAllCourses()
      })
      expect(useCourseStore.getState().courses).toHaveLength(0)
      expect(useCourseStore.getState().selectedCourse).toBeNull()
    })
  })

  describe('setSelectedCourse', () => {
    it('should set selected course', () => {
      const course = createTestCourse('Math 101')
      act(() => {
        useCourseStore.getState().addCourse(course)
        useCourseStore.getState().setSelectedCourse(course)
      })
      expect(useCourseStore.getState().selectedCourse?.name).toBe('Math 101')
    })

    it('should allow clearing selected course', () => {
      const course = createTestCourse('Math 101')
      act(() => {
        useCourseStore.getState().addCourse(course)
        useCourseStore.getState().setSelectedCourse(course)
        useCourseStore.getState().setSelectedCourse(null)
      })
      expect(useCourseStore.getState().selectedCourse).toBeNull()
    })
  })

  describe('setCurrentColor', () => {
    it('should set current color', () => {
      act(() => {
        useCourseStore.getState().setCurrentColor('bg-blue-500')
      })
      expect(useCourseStore.getState().currentColor).toBe('bg-blue-500')
    })
  })

  describe('addCourse with group isActive handling', () => {
    it('should default group isActive to true when not specified', () => {
      const course = createTestCourse('Math 101')
      delete (course.groups[0] as { isActive?: boolean }).isActive
      act(() => {
        useCourseStore.getState().addCourse(course)
      })
      expect(useCourseStore.getState().courses[0].groups[0].isActive).toBe(true)
    })

    it('should preserve group isActive when explicitly set to false', () => {
      const course = createTestCourse('Math 101')
      course.groups[0].isActive = false
      act(() => {
        useCourseStore.getState().addCourse(course)
      })
      expect(useCourseStore.getState().courses[0].groups[0].isActive).toBe(false)
    })
  })

  describe('updateCourse with group isActive handling', () => {
    it('should default group isActive to true on update when not specified', () => {
      const course = createTestCourse('Math 101')
      act(() => {
        useCourseStore.getState().addCourse(course)
      })

      const updatedCourse = { ...course, name: 'Math 102' }
      delete (updatedCourse.groups[0] as { isActive?: boolean }).isActive
      act(() => {
        useCourseStore.getState().updateCourse('Math 101', updatedCourse)
      })
      expect(useCourseStore.getState().courses[0].groups[0].isActive).toBe(true)
    })
  })

  describe('toggleGroupVisibility', () => {
    it('should update selectedCourse when toggling group of selected course', () => {
      const course = createTestCourse('Math 101')
      act(() => {
        useCourseStore.getState().addCourse(course)
        useCourseStore.getState().setSelectedCourse(useCourseStore.getState().courses[0])
        useCourseStore.getState().toggleGroupVisibility('Math 101', 'Group 1')
      })
      expect(useCourseStore.getState().selectedCourse?.groups[0].isActive).toBe(false)
    })

    it('should not update selectedCourse when toggling group of different course', () => {
      const course1 = createTestCourse('Math 101')
      const course2 = createTestCourse('Physics 201')
      act(() => {
        useCourseStore.getState().addCourse(course1)
        useCourseStore.getState().addCourse(course2)
        useCourseStore.getState().setSelectedCourse(useCourseStore.getState().courses[0])
        useCourseStore.getState().toggleGroupVisibility('Physics 201', 'Group 1')
      })
      expect(useCourseStore.getState().selectedCourse?.groups[0].isActive).toBe(true)
    })
  })

  describe('loadSampleData', () => {
    it('should load sample courses and clear selected course', () => {
      const course = createTestCourse('Math 101')
      act(() => {
        useCourseStore.getState().addCourse(course)
        useCourseStore.getState().setSelectedCourse(course)
        useCourseStore.getState().loadSampleData('single')
      })
      const state = useCourseStore.getState()
      expect(state.courses.length).toBeGreaterThan(0)
      expect(state.selectedCourse).toBeNull()
    })
  })
})
