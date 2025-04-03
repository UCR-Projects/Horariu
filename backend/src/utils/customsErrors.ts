export class CustomError extends Error {
  statusCode: number
  constructor (message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export class ValidationError extends CustomError {
  details: Array<{ path: string; message: string }>

  constructor (details: Array<{ path: string; message: string }>) {
    super('Validation error', 400)
    this.name = 'ValidationError'
    this.details = details
  }
}

export class AuthenticationError extends CustomError {
  constructor (message: string = 'Invalid email or password') {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

export class InternalServerError extends CustomError {
  constructor (message: string = 'Internal server error') {
    super(message, 500)
    this.name = 'InternarServerError'
  }
}
