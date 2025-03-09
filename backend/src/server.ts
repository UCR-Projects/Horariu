import { APIGatewayProxyHandler, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { UserController } from './controllers/userController'
import { CourseController } from './controllers/courseController'
import { verifyToken } from './middlewares/auth'

const getCorsHeaders = (origin: string, methods: string) => ({
  /* eslint-disable @typescript-eslint/naming-convention */
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': methods,
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
  /* eslint-enable @typescript-eslint/naming-convention */
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path, body } = event

    const origin = event.headers?.origin ?? 'http://localhost:5173'

    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: getCorsHeaders(origin, 'OPTIONS, GET, POST, PATCH, DELETE'),
        body: JSON.stringify({ message: 'CORS preflight successful' })
      }
    }

    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body

    if (httpMethod === 'POST' && path === '/register') {
      const result = await UserController.register(parsedBody)
      return {
        statusCode: 201,
        headers: getCorsHeaders(origin, 'OPTIONS, POST'),
        body: result.body
      }
    }

    if (httpMethod === 'POST' && path === '/login') {
      const result = await UserController.login(parsedBody)
      return {
        statusCode: 201,
        headers: getCorsHeaders(origin, 'OPTIONS, POST'),
        body: result.body
      }
    }

    if (httpMethod === 'POST' && path === '/courses/generate') {
      const result = await CourseController.generateSchedules(parsedBody)
      return {
        statusCode: 200,
        headers: getCorsHeaders(origin, 'OPTIONS, POST'),
        body: result.body
      }
    }

    if (httpMethod === 'POST' && path === '/courses') {
      const user = verifyToken(event.headers?.Authorization)
      const result = await CourseController.registerCourse(user.userId, parsedBody)
      return {
        statusCode: 200,
        headers: getCorsHeaders(origin, 'OPTIONS, POST'),
        body: result.body
      }
    }

    if (httpMethod === 'GET' && path === '/courses') {
      const user = verifyToken(event.headers?.Authorization)
      const result = await CourseController.getCourses(user.userId)
      return {
        statusCode: 200,
        headers: getCorsHeaders(origin, 'OPTIONS, GET'),
        body: result.body
      }
    }

    if (httpMethod === 'GET' && path.startsWith('/courses/')) {
      const user = verifyToken(event.headers?.Authorization)
      const pathParameters = event.pathParameters || {}
      if (Object.keys(pathParameters).length === 0 || Object.values(pathParameters).some(value => !value)) {
        return {
          statusCode: 400,
          headers: getCorsHeaders(origin, 'OPTIONS, GET'),
          body: JSON.stringify({ message: 'Missing required path parameters' })
        }
      }
      const result = await CourseController.getCourse(user.userId, pathParameters)
      return {
        statusCode: 200,
        headers: getCorsHeaders(origin, 'OPTIONS, GET'),
        body: result.body
      }
    }

    if (httpMethod === 'PATCH' && path.startsWith('/courses/')) {
      const user = verifyToken(event.headers?.Authorization)
      const pathParameters = event.pathParameters || {}
      if (Object.keys(pathParameters).length === 0 || Object.values(pathParameters).some(value => !value)) {
        return {
          statusCode: 400,
          headers: getCorsHeaders(origin, 'OPTIONS, PATCH'),
          body: JSON.stringify({ message: 'Missing required path parameters' })
        }
      }
      const result = await CourseController.updateCourse(user.userId, pathParameters, parsedBody)
      return {
        statusCode: 200,
        headers: getCorsHeaders(origin, 'OPTIONS, PATCH'),
        body: result.body
      }
    }

    if (httpMethod === 'DELETE' && path.startsWith('/courses/')) {
      const user = verifyToken(event.headers?.Authorization)
      const pathParameters = event.pathParameters || {}
      if (Object.keys(pathParameters).length === 0 || Object.values(pathParameters).some(value => !value)) {
        return {
          statusCode: 400,
          headers: getCorsHeaders(origin, 'OPTIONS, DELETE'),
          body: JSON.stringify({ message: 'Missing required path parameters' })
        }
      }
      const result = await CourseController.deleteCourse(user.userId, pathParameters)
      return {
        statusCode: 200,
        headers: getCorsHeaders(origin, 'OPTIONS, DELETE'),
        body: result.body
      }
    }

    return {
      statusCode: 404,
      headers: getCorsHeaders(origin, 'OPTIONS, GET, POST, PATCH, DELETE'),
      body: JSON.stringify({ message: 'Path not found', pathReceived: path })
    }
  } catch (error) {
    console.error('Error on Lambda:', error)
    return {
      statusCode: 500,
      headers: getCorsHeaders(origin, 'OPTIONS, GET, POST, PATCH, DELETE'),
      body: JSON.stringify({ message: 'Internal server error' })
    }
  }
}
