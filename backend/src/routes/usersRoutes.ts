import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { UserModel } from "../models/userModel"

interface UsersRouterParams {
    userModel: UserModel
}

export const createUsersRouter = ({ userModel }: UsersRouterParams): Router => {
    const usersRouter = Router()
    const userController = new UserController({ userModel })

    usersRouter.post('/register', userController.register)
    usersRouter.post('/login', userController.login)

    return usersRouter
}