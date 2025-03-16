import axios from 'axios'
import { API_BASE_URL } from '@/config/config'

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
