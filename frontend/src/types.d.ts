export type TimeRange = string
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'


export interface Schedule {
  [day: Day]: {
    start?: string;
    end?: string;
  };
}
export interface Group {
  name: string;
  schedule: Schedule;
}

export interface Course  {
  name: string;
  color: string;
  groups: Group[];
}


