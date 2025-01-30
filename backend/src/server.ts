import { createApp, startApp } from './app'
import { pool } from './config/database'
import { UserModel } from './models/userModel'
import { CourseModel } from './models/courseModel'

const userModel: UserModel = new UserModel(pool)
const courseModel: CourseModel = new CourseModel(pool)

const app = createApp({ userModel, courseModel })


const startServer = async (): Promise<void> => {
  try {
    await startApp(app)
    console.log("Server started successfully")
  } catch(error) {
    console.error('Error starting the server', error)
    process.exit(1)
  }
}

startServer()
