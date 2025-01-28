import { Router } from 'express'
import { createUsersRouter } from './usersRoutes.js'
import { createCoursesRouter } from './coursesRoutes.js'

export const createApiRouter = ({ userModel, courseModel }) => {
    const apiRouter = Router()
    apiRouter.use('/users', createUsersRouter({ userModel }))
    apiRouter.use('/courses', createCoursesRouter({ courseModel }))
    return apiRouter
}
