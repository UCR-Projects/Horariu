import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UserController } from './controllers/userController'
import { CourseController } from './controllers/courseController'
import { verifyToken } from './middlewares/auth'
import { APIGatewayProxyEvent } from 'aws-lambda'

const userController = new UserController()
const courseController = new CourseController()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path, body } = event

    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body

    if (httpMethod === 'POST' && path === '/register') {
      const result = await userController.register(parsedBody)
      return {
        statusCode: 201,
        body: JSON.stringify(result)
      }
    }

    if (httpMethod === 'POST' && path === '/login') {
      const result = await userController.login(parsedBody)
      return {
        statusCode: 201,
        body: JSON.stringify(result)
      }
    }

    if (httpMethod === 'POST' && path === '/courses') {
      const user = verifyToken(event.headers?.Authorization)
      const result = await courseController.registerCourse(user.userId, parsedBody)
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    }

    if (httpMethod === 'GET' && path === '/courses') {
      const user = verifyToken(event.headers?.Authorization)
      const result = await courseController.getCourses(user.userId)
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Path not found', pathReceived: path })
    }
  } catch (error) {
    console.error('Error on Lambda:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    }
  }
}
