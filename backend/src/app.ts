import express, { Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { createApiRouter } from './routes/apiRoutes'
import { UserModel } from './models/userModel'
import { CourseModel } from './models/courseModel'
import { Server } from 'http'

interface AppModels {
    userModel: UserModel
    courseModel: CourseModel
}

export const createApp = ({ userModel, courseModel }: AppModels): Express => {
  const app = express()

  app.use(morgan('combined'))

  app.use(cors())
  app.use(express.json())

  app.use('/api/v1', createApiRouter({ userModel, courseModel }))

  app.get('/', (req, res) => {
    res.send('Welcome to the Horarius API!')
  })

  return app
}

export const startApp = (app: Express, port: number = 3000): Server => {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
  return server
}
