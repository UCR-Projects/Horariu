import { Request, Response } from 'express'
import { validateCourse, validateUpdateCourse, validateCourseParams } from '../schemas/course.schema'
import { validateUserId } from '../schemas/user.schema'
import { CourseModel } from '../models/courseModel'

interface CourseControllerParams {
    courseModel: CourseModel
}

export class CourseController {
  private courseModel: CourseModel

  constructor ({ courseModel }: CourseControllerParams) {
    this.courseModel = courseModel
  }

  private async _validateUser (req: Request, res: Response): Promise<{ user_id: string } | null> {
    const userValid = await validateUserId(req.user)
    if (!userValid.success) {
      res.status(401).json({ errors: userValid.error.message })
      return null
    }
    return userValid.data
  }

  private async _validateParams (req: Request, res: Response): Promise< any | null> {
    const courseValid = await validateCourseParams(req.params)
    if (!courseValid.success) {
      res.status(401).json({ errors: courseValid.error.message })
      return null
    }
    return courseValid.data
  }

  registerCourse = async (req: Request, res: Response): Promise<any> => {
    try {
      const courseValid = await validateCourse(req.body)
      if (!courseValid.success) {
        return res.status(422).json({ errors: JSON.parse(courseValid.error.message) })
      }

      const user = await this._validateUser(req, res)
      if (!user) return

      const courseData = { ...courseValid.data, user_id: user.user_id }
      const newCourse = await this.courseModel.addCourse(courseData)

      if ('error' in newCourse) {
        return res.status(409).json({ message: newCourse.error })
      }

      return res.status(201).json({ message: 'Course registered successfully', newCourse })
    } catch (error) {
      console.error('[registerCourse]:', (error as Error).message)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  getCourses = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await this._validateUser(req, res)
      if (!user) return

      const courses = await this.courseModel.getCourses({ user_id: user.user_id })

      if (!courses || courses.length === 0) {
        return res.status(200).json({
          message: 'No courses found for this user',
          courses: []
        })
      }
      return res.status(200).json({
        message: 'Courses retrieved successfully',
        courses
      })
    } catch (error) {
      console.error('[getCourses]:', (error as Error).message)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  getCourse = async (req: Request, res: Response): Promise<any> => {
    try {
      const params = await this._validateParams(req, res)
      if (!params) return

      const user = await this._validateUser(req, res)
      if (!user) return

      const course = await this.courseModel.getCourse({ user_id: user.user_id, ...params })
      if (!course) {
        return res.status(404).json({ message: 'User course not found' })
      }
      return res.status(200).json({ message: 'Course retrieved successfully', course })
    } catch (error) {
      console.error('[getCourse]:', (error as Error).message)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  updateCourse = async (req: Request, res: Response): Promise<any> => {
    try {
      const params = await this._validateParams(req, res)
      if (!params) return

      const user = await this._validateUser(req, res)
      if (!user) return

      const updateValid = await validateUpdateCourse(req.body)
      if (!updateValid.success) {
        return res.status(422).json({ errors: JSON.parse(updateValid.error.message) })
      }

      const updatedCourse = await this.courseModel.updateCourse({ user_id: user.user_id, ...params }, updateValid.data)
      if (!updatedCourse) {
        return res.status(404).json({ message: 'User course not found' })
      }

      const updatedFieldsMessage = Object.keys(updateValid.data)
        .map((field) => `${field} updated successfully`)
        .join(', ')

      return res.status(200).json({
        message: updatedFieldsMessage,
        data: { ...params, ...updateValid.data }
      })
    } catch (error) {
      console.error('[updateCourse]:', (error as Error).message)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  deleteCourse = async (req: Request, res: Response): Promise<any> => {
    try {
      const params = await this._validateParams(req, res)
      if (!params) return

      const user = await this._validateUser(req, res)
      if (!user) return

      const deletedCourse = await this.courseModel.deleteCourse({ user_id: user.user_id, ...params })
      if (!deletedCourse) {
        return res.status(404).json({ message: 'Course not found or already deleted' })
      }

      return res.status(200).json({
        message: 'Course deleted successfully',
        deleted_course: params
      })
    } catch (error) {
      console.error('[deleteCourse]:', (error as Error).message)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
