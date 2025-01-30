import { Router } from 'express'
import { CourseController } from '../controllers/courseController'
import { authenticateUser } from '../middlewares/auth'
import { CourseModel } from '../models/courseModel'

interface CoursesRouterParams{
    courseModel: CourseModel
}

export const createCoursesRouter = ({ courseModel }: CoursesRouterParams): Router => {

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