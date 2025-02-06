import { createApp, startApp } from './app'

const app = createApp()

const startServer = async (): Promise<void> => {
  try {
    await startApp(app)
    console.log('Server started successfully')
  } catch (error) {
    console.error('Error starting the server', error)
    process.exit(1)
  }
}

startServer()
