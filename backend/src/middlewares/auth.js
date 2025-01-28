import jwt from 'jsonwebtoken'

export const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    if (!token){
        return res.status(401).json({ message: 'Invalid token format'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' })
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' })
        }
        return res.status(500).json({ message: 'Internal server error' })
    }
}