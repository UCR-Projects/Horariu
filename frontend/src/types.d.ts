export type TimeRange = string
export type Day = 'L' | 'K' | 'M' | 'J' | 'V' | 'S' | 'D'
export type Theme = 'dark' | 'light' | 'system'

export interface TimeBlock {
  start: string
  end: string
}

export interface Schedule {
  [key: string]: TimeBlock[]
}

export interface Group {
  name: string
  schedule: Schedule
  isActive: boolean
}

export interface Course {
  name: string
  color: string
  groups: Group[]
  isActive: boolean
}

export interface TailwindColor {
  name: string
  class: string
  value: string
}
