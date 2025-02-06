import { Router } from 'express'
import usersRouter from './usersRoutes'
import coursesRouter from './coursesRoutes'

const apiRouter = Router()

apiRouter.use('/users', usersRouter)
apiRouter.use('/courses', coursesRouter)

export default apiRouter
