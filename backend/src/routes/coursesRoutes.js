import { Router } from 'express'
import { CourseController } from '../controllers/courseController.js'

export const createCoursesRouter = ({ courseModel }) => {

    const coursesRouter = Router()
    const courseController = new CourseController({ courseModel })

    coursesRouter.post('/', courseController.registerCourse)

    return coursesRouter
}