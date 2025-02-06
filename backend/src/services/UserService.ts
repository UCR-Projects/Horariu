import { validateUser, validateLogin } from '../schemas/user.schema'
import { signToken } from '../utils/utils'
import { UserRepository } from '../repositories/userRepository'

interface IUserService {
  register(data: unknown): Promise<{ token: string }>;
  login(data: unknown): Promise<{ token: string }>;
}

export const UserService: IUserService = {
  async register (data: unknown): Promise<{ token: string }> {
    const result = await validateUser(data)
    if (!result.success) {
      throw new Error(JSON.stringify(result.error.format()))
    }

    const emailExists = await UserRepository.emailExists(result.data.email)
    if (emailExists) {
      throw new Error('Email already exists')
    }

    const newUser = await UserRepository.createUser(result.data)

    const token = signToken(newUser)

    return { token }
  },

  async login (data: unknown): Promise<{ token: string }> {
    const result = await validateLogin(data)
    if (!result.success) {
      throw new Error(JSON.stringify(result.error.format()))
    }

    const user = await UserRepository.verifyCredentials(result.data)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const token = signToken(user)

    return { token }
  }
}
