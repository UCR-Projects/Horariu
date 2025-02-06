import { db } from '../database/database'
import { users } from '../database/schema/users'
import { eq, count } from 'drizzle-orm'
import bcrypt from 'bcrypt'

interface IUserCredentials {
  email: string,
  password: string
}

export const UserRepository = {
  async createUser ({ email, password }: IUserCredentials): Promise<{ id: string; email: string }> {
    const hashedPass = await bcrypt.hash(password, 10)
    const userCreated = await db.insert(users).values({ email, password: hashedPass }).returning()
    return { id: userCreated[0].id, email: userCreated[0].email }
  },

  async emailExists (email: string): Promise<boolean> {
    const result = await db
      .select({ value: count() })
      .from(users)
      .where(eq(users.email, email))
    return result[0].value > 0
  },

  async verifyCredentials ({ email, password }: IUserCredentials): Promise<{ id: string; email: string } | null> {
    const userCredentials = await db
      .select({ id: users.id, email: users.email, password: users.password })
      .from(users)
      .where(eq(users.email, email))

    if (userCredentials.length === 0) return null

    const isValidPassword = await bcrypt.compare(password, userCredentials[0].password)
    if (!isValidPassword) return null

    return { id: userCredentials[0].id, email: userCredentials[0].email }
  }
}
