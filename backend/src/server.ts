import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UserController } from './controllers/userController'

const userController = new UserController()

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('🔑 DB_HOST:', process.env.DB_HOST)
  console.log('🔑 DB_USER:', process.env.DB_USER)

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

    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Path not found', pathRecibido: path })
    }
  } catch (error) {
    console.error('Error on Lambda:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    }
  }
}
