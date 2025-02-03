import { Router } from 'express'
import { createUsersRouter } from './usersRoutes'
import { createCoursesRouter } from './coursesRoutes'
import { UserModel } from '../models/userModel'
import { CourseModel } from '../models/courseModel'

interface ApiRouterParams {
    userModel: UserModel
    courseModel: CourseModel
}

export const createApiRouter = ({ userModel, courseModel }: ApiRouterParams): Router => {
  const apiRouter = Router()
  apiRouter.use('/users', createUsersRouter({ userModel }))
  apiRouter.use('/courses', createCoursesRouter({ courseModel }))
  return apiRouter
}
