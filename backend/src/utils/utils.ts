import jwt from 'jsonwebtoken'

interface UserPayload {
  id: string
  email: string
}

export const signToken = (user: UserPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  return jwt.sign(
    { user_id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}
