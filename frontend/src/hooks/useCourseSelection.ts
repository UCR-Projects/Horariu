import { Course } from '../types'
import useCourseStore from '../stores/useCourseStore'

export const useCourseSelection = () => {
  const {
    courses,
    selectedCourse,
    setSelectedCourse,
    deleteCourse,
    setEditMode,
  } = useCourseStore()

  const handleSelectCourse = (course: Course | null) => {
    setSelectedCourse(course)
  }

  const handleEditCourse = (course: Course) => {
    setEditMode(true, course)
    setSelectedCourse(course)
  }

  const handleDeleteCourse = (name: string) => {
    deleteCourse(name)
    if (selectedCourse?.name === name) {
      setEditMode(false)
    }
  }

  return {
    courses,
    selectedCourse,
    onSelectCourse: handleSelectCourse,
    onEditCourse: handleEditCourse,
    onDeleteCourse: handleDeleteCourse,
  }
}
