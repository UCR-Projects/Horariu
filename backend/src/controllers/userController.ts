import { UserService } from '../services/UserService'
import { UserCredentials } from '../schemas/user.schema'

export class UserController {
  register = async (user: UserCredentials) => {
    try {
      const { token } = await UserService.register(user)

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

  login = async (user: UserCredentials) => {
    try {
      const { token } = await UserService.login(user)
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
