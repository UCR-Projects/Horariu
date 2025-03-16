import { publicApi } from './apiConfig'
import { Course } from '@/types'

export const generateScheduleService = {
  async generateSchedule(coursesData: Course[]) {
    try {
      const response = await publicApi.post('/generate', coursesData)
      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[fetch] Error generating schedule:', error)
      }
      throw new Error('Error generating schedule')
    }
  },
}
