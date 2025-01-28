import { Router } from 'express'
import { createUsersRouter } from './usersRoutes.js'

export const createApiRouter = ({ userModel }) => {
    const apiRouter = Router()
    apiRouter.use('/users', createUsersRouter({ userModel }))
    return apiRouter
}
