import { Day, TimeRange } from '@/types'

const START_TIMES: string[] = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
]

const END_TIMES: string[] = [
  '07:50',
  '08:50',
  '09:50',
  '10:50',
  '11:50',
  '12:50',
  '13:50',
  '14:50',
  '15:50',
  '16:50',
  '17:50',
  '18:50',
  '19:50',
  '20:50',
  '21:50',
  '22:50',
]

const TIME_RANGES: TimeRange[] = START_TIMES.map(
  (startTime, index) => `${startTime} - ${END_TIMES[index]}`
)

const DAYS: Day[] = ['L', 'K', 'M', 'J', 'V', 'S', 'D']

export { START_TIMES, END_TIMES, TIME_RANGES, DAYS }

// Re-export DEFAULT_COLOR from colorPalette for backwards compatibility
export { DEFAULT_COLOR } from './colorPalette'

export const SCHEDULES_PER_PAGE = 5
