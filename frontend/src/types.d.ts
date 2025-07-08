export type TimeRange = string
export type Day = 'L' | 'K' | 'M' | 'J' | 'V' | 'S' | 'D'
export type Theme = 'dark' | 'light' | 'system'
export interface Schedule {
  [key: string]: {
    start: string
    end: string
  }
}

export interface Group {
  name: string
  schedule: Schedule
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
