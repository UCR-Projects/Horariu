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

export class UnauthorizedError extends CustomError {
  constructor (message: string = 'Unauthorized') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

export class AuthenticationError extends CustomError {
  constructor (message: string = 'Invalid email or password') {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

export class NotFoundError extends CustomError {
  constructor (message = 'Resource not found') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends CustomError {
  constructor (message: string = 'Conflict') {
    super(message, 409)
    this.name = 'ConflictError'
  }
}

export class UnprocessableEntityError extends CustomError {
  constructor (message: string = 'Cannot generate schedules') {
    super(message, 422)
    this.name = 'UnprocessableEntityError'
  }
}

export class InternalServerError extends CustomError {
  constructor (message: string = 'Internal server error') {
    super(message, 500)
    this.name = 'InternarServerError'
  }
}
