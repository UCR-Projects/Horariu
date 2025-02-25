export type TimeRange = string
export type Day = 'L' | 'K' | 'M' | 'J' | 'V' | 'S' | 'D'

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
}

export interface TailwindColor {
  name: string
  class: string
  value: string
}
