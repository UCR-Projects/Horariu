import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { timestamps } from './columns'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  ...timestamps
})
