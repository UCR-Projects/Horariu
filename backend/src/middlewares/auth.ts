import jwt from 'jsonwebtoken'

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

const checkAuthHeader = (authHeader: string | undefined): string => {
  if (!authHeader) {
    throw new Error('[UNAUTHORIZED]: No token provided')
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    throw new Error('[UNAUTHORIZED]: Invalid token format')
  }
  return token
}

export const verifyToken = (authHeader: string | undefined): AuthenticatedUser => {
  const token = checkAuthHeader(authHeader)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload & { userId: string; email: string }
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('[UNAUTHORIZED]: Token expired, please login again')
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('[UNAUTHORIZED]: Invalid token')
    } else {
      throw new Error('Internal server error')
    }
  }
}
