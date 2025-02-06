import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema',
  out: './src/database/migrations',
  dbCredentials: {
    url: process.env.DB_URI as string
  },

  schemaFilter: 'public',
  tablesFilter: ['users', 'courses'],

  introspect: {
    casing: 'camel'
  },

  migrations: {
    prefix: 'timestamp',
    table: '__drizzle_migrations__',
    schema: 'public'
  },

  breakpoints: true,
  strict: true,
  verbose: true
})
