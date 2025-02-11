import { CourseService } from '../services/CourseService'

export class CourseController {
  registerCourse = async (userId: string, course: unknown) => {
    try {
      if (!userId) {
        throw new Error('[UNAUTHORIZED]: User not found')
      }

      const newCourse = await CourseService.registerCourse(userId, course)
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
      if (!userId) {
        throw new Error('[UNAUTHORIZED]: User not found')
      }
      const course = await CourseService.getCourse(userId, params)
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Courses retrieved successfully', course })
      }
    } catch (error) {
      console.error('[getCourse]:', (error as Error).message)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      }
    }
  }

  updateCourse = async (userId: string, params: unknown, body: unknown) => {
    try {
      if (!userId) {
        throw new Error('[UNAUTHORIZED]: User not found')
      }
      const updatedCourse = await CourseService.updateCourse(userId, params, body)
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
      const deletedCourse = await CourseService.deleteCourse(userId, params)
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
