import { UserService } from '../services/UserService'
import { validateUser, validateLogin } from '../schemas/user.schema'

export class UserController {
  register = async (user: unknown) => {
    try {
      const validatedUser = await validateUser(user)

      if (!validatedUser.success) {
        throw new Error(JSON.stringify(validatedUser.error.format()))
      }

      const { token } = await UserService.register(validatedUser.data)

      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'User created successfully', token })
      }
    } catch (error) {
      console.error('[registerUser]:', (error as Error).message)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      }
    }
  }

  login = async (user: unknown) => {
    try {
      const validatedUser = await validateLogin(user)

      if (!validatedUser.success) {
        throw new Error(JSON.stringify(validatedUser.error.format()))
      }
      const { token } = await UserService.login(validatedUser.data)
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Login successful', token })
      }
    } catch (error) {
      console.error('[loginUser]:', (error as Error).message)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      }
    }
  }
}
