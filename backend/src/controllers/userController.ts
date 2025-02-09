import { UserService } from '../services/UserService'
import { UserRegisterInput } from '../schemas/user.schema'

export class UserController {
  register = async (data: UserRegisterInput) => {
    try {
      const { token } = await UserService.register(data)

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

  login = async (data: UserRegisterInput) => {
    try {
      const { token } = await UserService.login(data)
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
