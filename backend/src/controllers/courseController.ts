import { CourseService } from '../services/CourseService'
import { validateCourse, validateUpdateCourse, validateCourseParams } from '../schemas/course.schema'

export class CourseController {
  registerCourse = async (userId: string, course: unknown) => {
    try {
      if (!userId) {
        throw new Error('[UNAUTHORIZED]: User not found')
      }

      const courseValid = await validateCourse(course)
      if (!courseValid.success) {
        throw new Error('Validation failed')
      }

      const newCourse = await CourseService.registerCourse(userId, courseValid.data)
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Courses registered successfully', newCourse })
      }
    } catch (error) {
      console.error('[registerCourse]:', (error as Error).message)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      }
    }
  }

  getCourses = async (userId: string) => {
    try {
      if (!userId) {
        throw new Error('[UNAUTHORIZED]: User not found')
      }
      const courses = await CourseService.getCourses(userId)
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Courses found successfully', courses })
      }
    } catch (error) {
      console.error('[getCourses]:', (error as Error).message)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      }
    }
  }

  getCourse = async (userId: string, params: unknown) => {
    try {
      const paramsValid = await validateCourseParams(params)
      if (!paramsValid.success) {
        throw new Error('Validation failed')
      }

      if (!userId) {
        throw new Error('[UNAUTHORIZED]: User not found')
      }
      const course = await CourseService.getCourse(userId, paramsValid.data)
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Course retrieved successfully', course })
      }
    } catch (error) {
      console.error('[getCourse]:', (error as Error).message)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      }
    }
  }

  updateCourse = async (userId: string, params: unknown, updates: unknown) => {
    try {
      if (!userId) {
        throw new Error('[UNAUTHORIZED]: User not found')
      }

      const paramsValid = await validateCourseParams(params)
      if (!paramsValid.success) {
        throw new Error('Validation failed')
      }

      const updateValid = await validateUpdateCourse(updates)
      if (!updateValid.success) {
        throw new Error('Validation failed')
      }

      const updatedCourse = await CourseService.updateCourse(userId, paramsValid.data, updateValid.data)
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Course updated successfully', updatedCourse })
      }
    } catch (error) {
      console.error('[updateCourse]:', (error as Error).message)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      }
    }
  }

  deleteCourse = async (userId: string, params: unknown) => {
    try {
      if (!userId) {
        throw new Error('[UNAUTHORIZED]: User not found')
      }

      const paramsValid = await validateCourseParams(params)
      if (!paramsValid.success) {
        throw new Error('Validation failed')
      }

      const deletedCourse = await CourseService.deleteCourse(userId, paramsValid.data)
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Course deleted successfully', deletedCourse })
      }
    } catch (error) {
      console.error('[deleteCourse]:', (error as Error).message)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      }
    }
  }
}
