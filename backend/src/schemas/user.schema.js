import { z } from 'zod'

export const userSchema = z.object({
  email: z.string({
    invalid_type_error: 'Email must be a string',
    required_error: 'Email is required',
  }).email('Invalid email format'),

  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required',
  }).min(8).max(20)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
})

export const loginSchema = z.object({
  email: z.string({
    invalid_type_error: 'Email must be a string',
    required_error: 'Email is required',
  }),

  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required',
  })
})

export async function validateUser(user) {
  return userSchema.safeParseAsync(user)
}

export async function validateLogin(login) {
  return loginSchema.safeParseAsync(login)
}

export async function validateUserId(user) {
  return z.object({
    user_id: z.string()
  }).safeParseAsync(user)
}