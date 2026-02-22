export type TimeRange = string
export type Day = 'L' | 'K' | 'M' | 'J' | 'V' | 'S' | 'D'
export type Theme = 'dark' | 'light' | 'system'

export interface TimeBlock {
  start: string
  end: string
}

// New unified format: array of day schedules
export interface DaySchedule {
  day: Day
  active: boolean
  timeBlocks: TimeBlock[]
}

// Schedule is now an array of DaySchedule
export type Schedule = DaySchedule[]

// Legacy format for API compatibility
export interface ApiSchedule {
  [key: string]: TimeBlock[]
}

export interface Group {
  name: string
  schedule: Schedule
  isActive: boolean
}

export interface Course {
  name: string
  color: string // Hex color value (e.g., '#ef4444')
  groups: Group[]
  isActive: boolean
}
