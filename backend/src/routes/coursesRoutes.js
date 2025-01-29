import { Router } from 'express'
import { CourseController } from '../controllers/courseController.js'
import { authenticateUser } from '../middlewares/auth.js'

export const createCoursesRouter = ({ courseModel }) => {

    const coursesRouter = Router()
    const courseController = new CourseController({ courseModel })
    coursesRouter.use(authenticateUser)

    coursesRouter.post('/', courseController.registerCourse)
    coursesRouter.get('/', courseController.getCourses)
    coursesRouter.get('/:course_name/:day/:start_time', courseController.getCourse)
    coursesRouter.patch("/:course_name/:day/:start_time", courseController.updateCourse)
    coursesRouter.delete("/:course_name/:day/:start_time", courseController.deleteCourse)
    
    return coursesRouter
}