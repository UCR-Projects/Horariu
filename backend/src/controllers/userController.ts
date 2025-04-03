import { UserService } from '../services/UserService'
import { validateUser, validateLogin } from '../schemas/user.schema'
import { ValidationError, AuthenticationError } from '../utils/customsErrors'

export const UserController = {
  async register (user: unknown) {
    try {
      const validatedUser = await validateUser(user)

      if (!validatedUser.success) {
        const errors = validatedUser.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
        throw new ValidationError(errors)
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
  },

  async login (user: unknown) {
    try {
      const validatedUser = await validateLogin(user)

      if (!validatedUser.success) {
        const errors = validatedUser.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
        throw new ValidationError(errors)
      }
      const { token } = await UserService.login(validatedUser.data)
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Login successful', token })
      }
    } catch (error) {
      console.error('[loginUser]:', (error as Error).message)
      if (error instanceof ValidationError) {
        return {
          statusCode: error.statusCode,
          body: JSON.stringify({ errors: error.details })
        }
      }
      if (error instanceof AuthenticationError) {
        return {
          statusCode: error.statusCode,
          body: JSON.stringify({ message: error.message })
        }
      }
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      }
    }
  }
}
