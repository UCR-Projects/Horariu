import { UserCredentials } from '../schemas/user.schema'
import { signToken } from '../utils/utils'
import { UserRepository } from '../repositories/userRepository'

export const UserService = {
  async register (user: UserCredentials): Promise<{ token: string }> {
    const emailExists = await UserRepository.emailExists(user.email)
    if (emailExists) {
      throw new Error('Email already exists')
    }

    const newUser = await UserRepository.createUser(user)

    const token = signToken(newUser)

    return { token }
  },

  async login (user: UserCredentials): Promise<{ token: string }> {
    const verifiedUser = await UserRepository.verifyCredentials(user)
    if (!verifiedUser) {
      throw new Error('Invalid credentials')
    }

    const token = signToken(verifiedUser)

    return { token }
  }
}
