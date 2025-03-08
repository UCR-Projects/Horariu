import { publicApi } from './apiConfig'
import { Course } from '@/types'

export const generateScheduleService = {
  async generateSchedule(coursesData: Course[]) {
    try {
      const response = await publicApi.post('/generate', coursesData)
      return response.data
    } catch (error) {
      console.error('Error generating schedule:', error)
      throw new Error('fetch: Error generating schedule')
    }
  },
}
