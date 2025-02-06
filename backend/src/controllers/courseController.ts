import { Request, Response } from 'express'
import { CourseService } from '../services/CourseService'
export class CourseController {
  registerCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const newCourse = await CourseService.registerCourse(userId, req.body)
      res.status(201).json({ message: 'Course registered successfully', newCourse })
    } catch (error) {
      console.error('[registerCourse]:', error)

      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          res.status(409).json({ message: error.message })
          return
        }
        res.status(422).json({ message: error.message })
        return
      }
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }
      const courses = await CourseService.getCourses(userId)
      res.status(200).json({ message: 'Courses retrieved successfully', courses })
    } catch (error) {
      console.error('[getCourses]:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  getCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const course = await CourseService.getCourse(userId, req.params)
      res.status(200).json({ message: 'Course retrieved successfully', course })
    } catch (error) {
      console.error('[getCourse]:', (error as Error).message)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const updatedCourse = await CourseService.updateCourse(userId, req.params, req.body)
      res.status(200).json({ message: 'Course updated successfully', updatedCourse })
    } catch (error) {
      console.error('[updateCourse]:', (error as Error).message)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const deletedCourse = await CourseService.deleteCourse(userId, req.params)
      res.status(200).json({ message: 'Course deleted successfully', deletedCourse })
    } catch (error) {
      console.error('[deleteCourse]:', (error as Error).message)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
