import { createApp, startApp } from './src/app.js'
import { pool } from './src/config/database.js'
import { UserModel } from './src/models/userModel.js'
import { CourseModel } from './src/models/courseModel.js'

const userModel = new UserModel(pool)
const courseModel = new CourseModel(pool)

const app = createApp({ userModel, courseModel })

try {
  await startApp(app)
} catch (error) {
  console.error('Error starting the server', error)
}