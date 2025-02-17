export type TimeRange = string
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

interface ScheduleCell {
  hour: TimeRange
  day: Day
}