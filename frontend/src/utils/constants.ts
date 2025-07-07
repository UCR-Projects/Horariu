import { Day, TimeRange, TailwindColor } from '../types'

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

const COLORS: TailwindColor[] = [
  { name: 'Slate', class: 'bg-slate-200', value: 'bg-slate-200' },
  { name: 'Zinc', class: 'bg-zinc-200', value: 'bg-zinc-200' },
  { name: 'Neutral', class: 'bg-neutral-200', value: 'bg-neutral-200' },
  { name: 'Stone', class: 'bg-stone-200', value: 'bg-stone-200' },
  { name: 'Red', class: 'bg-red-500', value: 'bg-red-500' },
  { name: 'Orange', class: 'bg-orange-500', value: 'bg-orange-500' },
  { name: 'Amber', class: 'bg-amber-400', value: 'bg-amber-400' },
  { name: 'Yellow', class: 'bg-yellow-300', value: 'bg-yellow-300' },
  { name: 'Lime', class: 'bg-lime-400', value: 'bg-lime-400' },
  { name: 'Green', class: 'bg-green-500', value: 'bg-green-500' },
  { name: 'Emerald', class: 'bg-emerald-500', value: 'bg-emerald-500' },
  { name: 'Teal', class: 'bg-teal-500', value: 'bg-teal-500' },
  { name: 'Cyan', class: 'bg-cyan-500', value: 'bg-cyan-500' },
  { name: 'Sky', class: 'bg-sky-500', value: 'bg-sky-500' },
  { name: 'Blue', class: 'bg-blue-500', value: 'bg-blue-500' },
  { name: 'Indigo', class: 'bg-indigo-500', value: 'bg-indigo-500' },
  { name: 'Violet', class: 'bg-violet-500', value: 'bg-violet-500' },
  { name: 'Purple', class: 'bg-purple-500', value: 'bg-purple-500' },
  { name: 'Fuchsia', class: 'bg-fuchsia-500', value: 'bg-fuchsia-500' },
  { name: 'Pink', class: 'bg-pink-500', value: 'bg-pink-500' },
  { name: 'Rose', class: 'bg-rose-500', value: 'bg-rose-500' },
]

const DEFAULT_COLOR = COLORS[4].value

export { START_TIMES, END_TIMES, TIME_RANGES, DAYS, COLORS, DEFAULT_COLOR }

export const SCHEDULES_PER_PAGE = 5
