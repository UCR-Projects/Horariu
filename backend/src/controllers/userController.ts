import { Request, Response } from 'express'
import { validateUser, validateLogin } from '../schemas/user.schema'
import { signToken } from '../utils/utils'
import { UserModel } from '../models/userModel'

interface UserControllerParams {
    userModel: UserModel;
}

export class UserController {
  private userModel: UserModel

  constructor ({ userModel }: UserControllerParams) {
    this.userModel = userModel
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await validateUser(req.body)
      if (!result.success) {
        res.status(422).json({ errors: JSON.parse(result.error.message) })
        return
      }

      const emailExists = await this.userModel.emailExists(result.data)
      if (emailExists) {
        res.status(409).json({ message: 'Email already exists' })
        return
      }

      const newUser = await this.userModel.create(result.data)
      const token = signToken(newUser)

      res.status(201).json({ message: 'User created successfully', token })
    } catch (error) {
      console.error('[registerUser]:', (error as Error).message)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await validateLogin(req.body)
      if (!result.success) {
        res.status(422).json({ errors: JSON.parse(result.error.message) })
        return
      }
      const user = await this.userModel.verifyCredentials(result.data)

      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' })
        return
      }

      const token = signToken(user)

      res.status(201).json({ message: 'Login successful', token })
    } catch (error) {
      console.error('[loginUser]:', (error as Error).message)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
