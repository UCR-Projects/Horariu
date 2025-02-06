import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import dotenv from 'dotenv'

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
dotenv.config({ path: envFile })

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

const getDatabaseConfig = (): DatabaseConfig => {
  const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT']
  const missingVars = requiredEnvVars.filter((key) => !process.env[key])

  if (missingVars.length > 0) {
    throw new Error(`Environment variables missing for the database configuration: ${missingVars.join(', ')}`)
  }

  return {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    port: Number(process.env.DB_PORT)
  }
}

const pool = new Pool(getDatabaseConfig())

export const db = drizzle(pool)
