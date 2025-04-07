import { APIGatewayProxyHandler, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { UserController } from './controllers/userController'
import { CourseController } from './controllers/courseController'
import { UnauthorizedError } from './utils/customsErrors'

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
        statusCode: result.statusCode ?? 500,
        headers: getCorsHeaders(origin, 'OPTIONS, POST'),
        body: result.body
      }
    }

    if (httpMethod === 'POST' && path === '/login') {
      const result = await UserController.login(parsedBody)
      return {
        statusCode: result.statusCode ?? 500,
        headers: getCorsHeaders(origin, 'OPTIONS, POST'),
        body: result.body
      }
    }

    if (httpMethod === 'POST' && path === '/courses/generate') {
      const result = await CourseController.generateSchedules(parsedBody)
      return {
        statusCode: result.statusCode ?? 500,
        headers: getCorsHeaders(origin, 'OPTIONS, POST'),
        body: result.body
      }
    }

    if (httpMethod === 'POST' && path === '/courses') {
      if (!event.requestContext.authorizer || !event.requestContext.authorizer.principalId) {
        throw new UnauthorizedError('Missing authorization context')
      }
      const userId = event.requestContext.authorizer.principalId
      const result = await CourseController.registerCourse(userId, parsedBody)
      return {
        statusCode: result.statusCode ?? 500,
        headers: getCorsHeaders(origin, 'OPTIONS, POST'),
        body: result.body
      }
    }

    if (httpMethod === 'GET' && path === '/courses') {
      if (!event.requestContext.authorizer || !event.requestContext.authorizer.principalId) {
        throw new UnauthorizedError('Missing authorization context')
      }
      const userId = event.requestContext.authorizer.principalId
      const result = await CourseController.getCourses(userId)
      return {
        statusCode: result.statusCode ?? 500,
        headers: getCorsHeaders(origin, 'OPTIONS, GET'),
        body: result.body
      }
    }

    if (httpMethod === 'GET' && path.startsWith('/courses/')) {
      if (!event.requestContext.authorizer || !event.requestContext.authorizer.principalId) {
        throw new Error('[UNAUTHORIZED]: Missing authorization context')
      }
      const userId = event.requestContext.authorizer.principalId
      const pathParameters = event.pathParameters || {}
      if (Object.keys(pathParameters).length === 0 || Object.values(pathParameters).some(value => !value)) {
        return {
          statusCode: 400,
          headers: getCorsHeaders(origin, 'OPTIONS, GET'),
          body: JSON.stringify({ message: 'Missing required path parameters' })
        }
      }
      const result = await CourseController.getCourse(userId, pathParameters)
      return {
        statusCode: result.statusCode ?? 500,
        headers: getCorsHeaders(origin, 'OPTIONS, GET'),
        body: result.body
      }
    }

    if (httpMethod === 'PATCH' && path.startsWith('/courses/')) {
      if (!event.requestContext.authorizer || !event.requestContext.authorizer.principalId) {
        throw new Error('[UNAUTHORIZED]: Missing authorization context')
      }
      const userId = event.requestContext.authorizer.principalId
      const pathParameters = event.pathParameters || {}
      if (Object.keys(pathParameters).length === 0 || Object.values(pathParameters).some(value => !value)) {
        return {
          statusCode: 400,
          headers: getCorsHeaders(origin, 'OPTIONS, PATCH'),
          body: JSON.stringify({ message: 'Missing required path parameters' })
        }
      }
      const result = await CourseController.updateCourse(userId, pathParameters, parsedBody)
      return {
        statusCode: result.statusCode ?? 500,
        headers: getCorsHeaders(origin, 'OPTIONS, PATCH'),
        body: result.body
      }
    }

    if (httpMethod === 'DELETE' && path.startsWith('/courses/')) {
      if (!event.requestContext.authorizer || !event.requestContext.authorizer.principalId) {
        throw new Error('[UNAUTHORIZED]: Missing authorization context')
      }
      const userId = event.requestContext.authorizer.principalId
      const pathParameters = event.pathParameters || {}
      if (Object.keys(pathParameters).length === 0 || Object.values(pathParameters).some(value => !value)) {
        return {
          statusCode: 400,
          headers: getCorsHeaders(origin, 'OPTIONS, DELETE'),
          body: JSON.stringify({ message: 'Missing required path parameters' })
        }
      }
      const result = await CourseController.deleteCourse(userId, pathParameters)
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
