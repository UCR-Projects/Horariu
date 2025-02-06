import { pgTable, uuid, text, time, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core'
import { users } from './users'
import { timestamps } from './columns'

export const courses = pgTable('courses', {
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseName: text('courseName').notNull(),
  day: text('day').notNull(),
  startTime: time('startTime').notNull(),
  endTime: time('endTime').notNull(),
  groupNumber: integer('groupNumber').default(1).notNull(),
  courseDetails: jsonb('courseDetails').default({}),
  ...timestamps
}, (table) => [
  primaryKey({ columns: [table.userId, table.courseName, table.day, table.startTime, table.groupNumber] })
])
