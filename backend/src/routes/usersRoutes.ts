import { Router } from 'express'
import { UserController } from '../controllers/userController'

const usersRouter = Router()
const userController = new UserController()

usersRouter.post('/register', userController.register)
usersRouter.post('/login', userController.login)

export default usersRouter
