import { Request } from 'express'
import jwt from 'jsonwebtoken'

declare module 'express-serve-static-core' {
    interface Request {
        user?: jwt.JwtPayload & { user_id: string; email: string }
    }
}