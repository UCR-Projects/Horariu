/**
 * API Base URL Configuration
 *
 * Options:
 * - 'local': http://localhost:3001/courses (run: cd backend && npm run dev:local)
 * - 'dev': AWS Lambda Dev environment
 * - 'prod': AWS Lambda Prod environment (default for production builds)
 *
 * Set VITE_API_ENV in .env.local to override:
 * VITE_API_ENV=local
 */
const API_ENDPOINTS = {
  local: 'http://localhost:3001/courses',
  dev: 'https://leoppwn6gf.execute-api.us-east-1.amazonaws.com/Dev/courses',
  prod: 'https://nhtp5kfwdj.execute-api.us-east-1.amazonaws.com/Prod/courses',
}

type ApiEnv = keyof typeof API_ENDPOINTS

const getApiEnv = (): ApiEnv => {
  // Check for explicit environment variable
  const envVar = import.meta.env.VITE_API_ENV as ApiEnv | undefined
  if (envVar && envVar in API_ENDPOINTS) {
    return envVar
  }
  // Default: dev for development, prod for production
  return import.meta.env.DEV ? 'dev' : 'prod'
}

export const API_BASE_URL = API_ENDPOINTS[getApiEnv()]
