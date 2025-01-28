import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createApiRouter } from './routes/apiRoutes.js'

export const createApp = ({ userModel, courseModel }) => {
    dotenv.config()
    const app = express()

    app.use(cors())
    app.use(express.json())

    app.use('/api/v1', createApiRouter({ userModel, courseModel }))

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
