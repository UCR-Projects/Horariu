import { Router } from 'express'
import { UserController } from '../controllers/userController.js'

export const createUsersRouter = ({ userModel }) => {

    const usersRouter = Router()
    const userController = new UserController({ userModel })

    usersRouter.post('/register', userController.register)
    usersRouter.post('/register', userController.login)
    usersRouter.post('/google-auth', userController.googleAuth)

    return usersRouter
}