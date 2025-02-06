import { Router } from 'express'
import { CourseController } from '../controllers/courseController'
import { authenticateUser } from '../middlewares/auth'

const coursesRouter = Router()
const courseController = new CourseController()

coursesRouter.use(authenticateUser)

coursesRouter.post('/', courseController.registerCourse)
coursesRouter.get('/', courseController.getCourses)
coursesRouter.get('/:courseName/:day/:startTime/:groupNumber', courseController.getCourse)
coursesRouter.patch('/:courseName/:day/:startTime/:groupNumber', courseController.updateCourse)
coursesRouter.delete('/:courseName/:day/:startTime/:groupNumber', courseController.deleteCourse)

export default coursesRouter
