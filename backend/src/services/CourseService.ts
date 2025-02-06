import { validateCourse, validateUpdateCourse, validateCourseParams } from '../schemas/course.schema'
import { CourseRepository } from '../repositories/courseRepository'

export const CourseService = {
  async registerCourse (userId: string, data: unknown) {
    const courseValid = await validateCourse(data)
    if (!courseValid.success) {
      throw new Error('Validation failed')
    }

    const newCourse = await CourseRepository.addCourse({ ...courseValid.data, userId })

    if ('error' in newCourse) {
      throw new Error(newCourse.error as string)
    }

    return newCourse
  },

  async getCourses (userId: string) {
    const courses = await CourseRepository.getCourses(userId)

    return courses && courses.length > 0 ? courses : []
  },

  async getCourse (userId: string, params: unknown) {
    const paramsValid = await validateCourseParams(params)
    if (!paramsValid.success) {
      throw new Error('Validation failed')
    }

    const course = await CourseRepository.getCourse({ userId, ...paramsValid.data })
    if (!course) {
      throw new Error('Course not found')
    }

    return course
  },

  async updateCourse (userId: string, params: unknown, updates: unknown) {
    const paramsValid = await validateCourseParams(params)
    if (!paramsValid.success) {
      throw new Error('Validation failed')
    }

    const updateValid = await validateUpdateCourse(updates)
    if (!updateValid.success) {
      throw new Error('Validation failed')
    }

    const updatedCourse = await CourseRepository.updateCourse({ userId, ...paramsValid.data }, updateValid.data)
    if (!updatedCourse) {
      throw new Error('Course not found')
    }

    return updatedCourse
  },

  async deleteCourse (userId: string, params: unknown) {
    const paramsValid = await validateCourseParams(params)
    if (!paramsValid.success) {
      throw new Error('Validation failed')
    }

    const deletedCourse = await CourseRepository.deleteCourse({ userId, ...paramsValid.data })
    if (!deletedCourse) {
      throw new Error('Course not found or already deleted')
    }

    return paramsValid.data
  }
}
