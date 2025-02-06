import jwt from 'jsonwebtoken'

declare module 'express-serve-static-core' {
    interface Request {
        user?: jwt.JwtPayload & { userId: string; email: string }
    }
}
