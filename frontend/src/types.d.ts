export type TimeRange = string
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

interface ScheduleCell {
  hour: TimeRange
  day: Day
}

interface Course  {
  name: string;
  color: string;
  groups: string[]; //TODO: Change to Group type
}