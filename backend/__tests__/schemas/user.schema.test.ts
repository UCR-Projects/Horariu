import { userSchema, loginSchema } from '../../src/schemas/user.schema'

describe('User Schema Validation', () => {
  it('should validate a correct user', () => {
    const result = userSchema.safeParse({
      email: 'test@example.com',
      password: 'Password1'
    })
    expect(result.success).toBe(true)
  })

  it('should fail if email is missing', () => {
    const result = userSchema.safeParse({
      password: 'Password1'
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().email?._errors).toContain('Email is required')
    }
  })

  it('should fail if password is too short', () => {
    const result = userSchema.safeParse({
      email: 'test@example.com',
      password: 'Pass1'
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().password?._errors).toContain(
        'String must contain at least 8 character(s)'
      )
    }
  })

  it('should fail if password does not contain an uppercase letter', () => {
    const result = userSchema.safeParse({
      email: 'test@example.com',
      password: 'password1'
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().password?._errors).toContain(
        'Password must contain at least one uppercase letter'
      )
    }
  })

  it('should fail if password does not contain a number', () => {
    const result = userSchema.safeParse({
      email: 'test@example.com',
      password: 'Password'
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().password?._errors).toContain(
        'Password must contain at least one number'
      )
    }
  })
})

describe('Login Schema Validation', () => {
  it('should validate a correct login object', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password'
    })
    expect(result.success).toBe(true)
  })

  it('should fail if email is missing', () => {
    const result = loginSchema.safeParse({
      password: 'password'
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().email?._errors).toContain('Email is required')
    }
  })

  it('should fail if password is missing', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com'
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().password?._errors).toContain('Password is required')
    }
  })
})
