import jwt from 'jsonwebtoken'

export const signToken = (user) => {
  return jwt.sign(
    { user_id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}