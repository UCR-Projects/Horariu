import express, { Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import apiRouter from './routes/apiRoutes'
import dotenv from 'dotenv'
import { Server } from 'http'

dotenv.config()

export const createApp = (): Express => {
  const app = express()

  app.use(morgan('combined'))

  app.use(cors())
  app.use(express.json())

  app.use('/api/v1', apiRouter)

  app.get('/', (req, res) => {
    res.send('Welcome to the Horarius API!')
  })

  return app
}

export const startApp = (app: Express, port: number = Number(process.env.PORT)): Server => {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
  return server
}
