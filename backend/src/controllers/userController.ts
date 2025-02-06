import { Request, Response } from 'express'
import { UserService } from '../services/UserService'

export class UserController {
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = await UserService.register(req.body)

      res.status(201).json({ message: 'User created successfully', token })
    } catch (error) {
      console.error('[registerUser]:', (error as Error).message)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = await UserService.login(req.body)

      res.status(201).json({ message: 'Login successful', token })
    } catch (error) {
      console.error('[loginUser]:', (error as Error).message)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
