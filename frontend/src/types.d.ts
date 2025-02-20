export type TimeRange = string
export type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

export interface Schedule {
  [day: Day]: {
    start?: string
    end?: string
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
