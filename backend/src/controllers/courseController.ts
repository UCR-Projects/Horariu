import { CourseService } from '../services/CourseService'
import { validateCourse, validateUpdateCourse, validateCourseParams } from '../schemas/course.schema'
import { validateCourses } from '../schemas/schedule.schema'
import { ValidationError, UnprocessableEntityError } from '../utils/customsErrors'

export const CourseController = {
  async generateSchedules (courses: unknown) {
    try {
      const validatedCourses = await validateCourses(courses)
      if (!validatedCourses.success) {
        const errors = validatedCourses.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
        throw new ValidationError(errors)
      }

      const schedules = await CourseService.generateSchedules(validatedCourses.data)
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Schedules generated successfully', schedules })
      }
    } catch (error) {
      console.error('[generateSchedule]:', error)
      if (error instanceof ValidationError) {
        return {
          statusCode: error.statusCode,
          body: JSON.stringify({ errors: error.details })
        }
      }
      if (error instanceof UnprocessableEntityError) {
        return {
          statusCode: error.statusCode,
          body: JSON.stringify({ message: error.message })
        }
      }
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      }
    }
  },

  async registerCourse (userId: string, course: unknown) {
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
  },

  async getCourses (userId: string) {
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
  },

  async getCourse (userId: string, params: unknown) {
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
  },

  async updateCourse (userId: string, params: unknown, updates: unknown) {
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
  },

  async deleteCourse (userId: string, params: unknown) {
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
