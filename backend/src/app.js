import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createUsersRouter } from './routes/usersRoutes.js'

export const createApp = ({userModel}) => {
    dotenv.config()
    const app = express()

    app.use(cors())
    app.use(express.json())

    app.use('/users', createUsersRouter({ userModel }))

    app.get("/", (req, res) => {
        res.send("Welcome to the Horarius API!")
    })

    return app
}

export const startApp = async (app, port = process.env.PORT ?? 3000) => {
    return new Promise((resolve) => {
        const server = app.listen(port, () => {
        console.log(`Server running on port http://localhost:${port}`)
        resolve(server)
        })
    })
}
