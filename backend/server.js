import { createApp, startApp } from './src/app.js'
import { pool } from './src/config/database.js'
import { UserModel } from './src/models/userModel.js'

const userModel = new UserModel(pool)

const app = createApp({ userModel })

try {
  await startApp(app)
} catch (error) {
  console.error('Error starting the server', error)
}