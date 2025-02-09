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

  // getCourse = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const userId = 'req.user?.userId'
  //     if (!userId) {
  //       res.status(401).json({ message: 'Unauthorized' })
  //       return
  //     }

  //     const course = await CourseService.getCourse(userId, req.params)
  //     res.status(200).json({ message: 'Course retrieved successfully', course })
  //   } catch (error) {
  //     console.error('[getCourse]:', (error as Error).message)
  //     res.status(500).json({ message: 'Internal server error' })
  //   }
  // }

  // updateCourse = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const userId = req.user?.userId
  //     if (!userId) {
  //       res.status(401).json({ message: 'Unauthorized' })
  //       return
  //     }

  //     const updatedCourse = await CourseService.updateCourse(userId, req.params, req.body)
  //     res.status(200).json({ message: 'Course updated successfully', updatedCourse })
  //   } catch (error) {
  //     console.error('[updateCourse]:', (error as Error).message)
  //     res.status(500).json({ message: 'Internal server error' })
  //   }
  // }

  // deleteCourse = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const userId = req.user?.userId
  //     if (!userId) {
  //       res.status(401).json({ message: 'Unauthorized' })
  //       return
  //     }

  //     const deletedCourse = await CourseService.deleteCourse(userId, req.params)
  //     res.status(200).json({ message: 'Course deleted successfully', deletedCourse })
  //   } catch (error) {
  //     console.error('[deleteCourse]:', (error as Error).message)
  //     res.status(500).json({ message: 'Internal server error' })
  //   }
  // }
}
