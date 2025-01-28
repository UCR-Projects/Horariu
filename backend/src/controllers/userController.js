import { validateUser, validateLogin } from "../schemas/user.schema.js"
import { signToken } from '../utils/utils.js'

export class UserController {
    constructor({ userModel }) {
        this.userModel = userModel
    }

    register = async (req, res) => {
        try {
            const result = await validateUser(req.body)
            if (!result.success) {
                return res.status(422).json({ errors: JSON.parse(result.error.message) })
            }
            if (await this.userModel.emailExists(result.data)) {
                return res.status(409).json({ message: 'Email already exists' })
            }
            const newUser = await this.userModel.create(result.data)
            const token = signToken(newUser)
            return res.status(201).json({ message: 'User created successfully', token })
        } catch (error) {
            console.error('[registerUser]:', error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }

    login = async (req, res) => {
        try {
            const result = await validateLogin(req.body)
            if (!result.success) {
                return res.status(422).json({ errors: JSON.parse(result.error.message) })
            }
            const user = await this.userModel.verifyCredentials(result.data)
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' })
            }
            const token = signToken(user)
            return res.status(201).json({ message: 'Login successful', token })
        } catch (error) {
            console.error('[loginUser]:', error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }
}