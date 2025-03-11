import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda'
import jwt from 'jsonwebtoken'

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

const checkAuthHeader = (authHeader: string): string => {
  const token = authHeader.split(' ')[1]
  if (!token) {
    throw new Error('[UNAUTHORIZED]: Invalid token format')
  }
  return token
}

export const verifyToken = (authHeader: string): AuthenticatedUser => {
  const token = checkAuthHeader(authHeader)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload & { userId: string; email: string }
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('[UNAUTHORIZED]: Token expired, please login again')
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('[UNAUTHORIZED]: Invalid token')
    } else {
      throw new Error('Internal server error')
    }
  }
}

/* eslint-disable @typescript-eslint/naming-convention */
const generatePolicy = (principalId: string, effect: 'Allow' | 'Deny', resource: string): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}
/* eslint-disable @typescript-eslint/naming-convention */

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  try {
    if (!event.authorizationToken) {
      throw new Error('[UNAUTHORIZED]: No authorization token provided')
    }
    const user = verifyToken(event.authorizationToken)
    return generatePolicy(user.userId, 'Allow', event.methodArn)
  } catch (error) {
    console.error('Authorization failed:', error instanceof Error ? error.message : String(error))
    return generatePolicy('Unauthorized', 'Deny', event.methodArn)
  }
}
