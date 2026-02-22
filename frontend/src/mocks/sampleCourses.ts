import { Course, Day, Schedule, TimeBlock } from '@/types'
import { DAYS } from '@/utils/constants'
import { COLOR_PALETTE } from '@/utils/colorPalette'

// Helper to get hex color by family index and shade
const getColor = (familyIndex: number, shade: 'light' | 'medium' | 'dark' = 'medium') => {
  const family = COLOR_PALETTE[familyIndex % COLOR_PALETTE.length]
  const shadeObj = family.shades.find((s) => s.name === shade) ?? family.shades[1]
  return shadeObj.hex
}

/**
 * Creates a schedule array from a map of day -> time blocks.
 * This is a helper to make sample data more readable.
 */
function createSchedule(dayBlocks: Partial<Record<Day, TimeBlock[]>>): Schedule {
  return DAYS.map((day) => ({
    day,
    active: !!dayBlocks[day] && dayBlocks[day]!.length > 0,
    timeBlocks: dayBlocks[day] || [],
  }))
}

export const sampleCoursesSingleOption: Course[] = [
  {
    name: 'Matemáticas',
    color: getColor(0), // Red
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ L: [{ start: '08:00', end: '09:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Historia',
    color: getColor(1), // Orange
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ M: [{ start: '10:00', end: '11:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Literatura',
    color: getColor(2), // Yellow
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ K: [{ start: '12:00', end: '13:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Biología',
    color: getColor(3), // Green
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ J: [{ start: '14:00', end: '15:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
]

export const sampleCoursesMultipleOptions: Course[] = [
  {
    name: 'Programación I',
    color: getColor(5), // Blue
    groups: [
      {
        name: 'Grupo A',
        schedule: createSchedule({
          L: [{ start: '08:00', end: '09:50' }],
          M: [{ start: '08:00', end: '09:50' }],
        }),
        isActive: true,
      },
      {
        name: 'Grupo B',
        schedule: createSchedule({
          M: [{ start: '10:00', end: '11:50' }],
          K: [{ start: '10:00', end: '11:50' }],
        }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Estructuras de Datos',
    color: getColor(6), // Purple
    groups: [
      {
        name: 'Grupo A',
        schedule: createSchedule({ M: [{ start: '11:00', end: '12:50' }] }),
        isActive: true,
      },
      {
        name: 'Grupo B',
        schedule: createSchedule({ J: [{ start: '12:00', end: '13:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Bases de Datos',
    color: getColor(4), // Teal
    groups: [
      {
        name: 'Grupo A',
        schedule: createSchedule({ K: [{ start: '14:00', end: '15:50' }] }),
        isActive: true,
      },
      {
        name: 'Grupo B',
        schedule: createSchedule({ V: [{ start: '14:00', end: '15:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Sistemas Operativos',
    color: getColor(7), // Pink
    groups: [
      {
        name: 'Grupo A',
        schedule: createSchedule({ J: [{ start: '15:00', end: '16:50' }] }),
        isActive: true,
      },
      {
        name: 'Grupo B',
        schedule: createSchedule({ V: [{ start: '16:00', end: '17:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
]

export const sampleCoursesHeavy: Course[] = [
  {
    name: 'Cálculo Avanzado',
    color: getColor(0, 'dark'), // Red dark
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({
          L: [{ start: '08:00', end: '09:50' }],
          M: [{ start: '08:00', end: '09:50' }],
        }),
        isActive: true,
      },
      {
        name: 'Grupo 2',
        schedule: createSchedule({
          M: [{ start: '10:00', end: '11:50' }],
          J: [{ start: '10:00', end: '11:50' }],
        }),
        isActive: true,
      },
      {
        name: 'Grupo 3',
        schedule: createSchedule({
          K: [{ start: '12:00', end: '13:50' }],
          V: [{ start: '12:00', end: '15:50' }],
        }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Física II',
    color: getColor(5, 'dark'), // Blue dark
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ L: [{ start: '14:00', end: '15:50' }] }),
        isActive: true,
      },
      {
        name: 'Grupo 2',
        schedule: createSchedule({ M: [{ start: '15:00', end: '16:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Química Orgánica',
    color: getColor(3, 'light'), // Green light
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ J: [{ start: '16:00', end: '17:50' }] }),
        isActive: true,
      },
      {
        name: 'Grupo 2',
        schedule: createSchedule({ V: [{ start: '17:00', end: '18:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Economía',
    color: getColor(2, 'light'), // Yellow light
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ L: [{ start: '18:00', end: '19:50' }] }),
        isActive: true,
      },
      {
        name: 'Grupo 2',
        schedule: createSchedule({ K: [{ start: '19:00', end: '20:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Historia del Arte',
    color: getColor(6, 'light'), // Purple light
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ M: [{ start: '20:00', end: '21:50' }] }),
        isActive: true,
      },
      {
        name: 'Grupo 2',
        schedule: createSchedule({ J: [{ start: '21:00', end: '22:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Literatura Contemporánea',
    color: getColor(7, 'medium'), // Pink medium
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ V: [{ start: '19:00', end: '20:50' }] }),
        isActive: true,
      },
      {
        name: 'Grupo 2',
        schedule: createSchedule({ L: [{ start: '20:00', end: '21:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
]

export const sampleCoursesConflict: Course[] = [
  {
    name: 'Curso A',
    color: getColor(0), // Red
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ L: [{ start: '08:00', end: '09:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Curso B',
    color: getColor(5), // Blue
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ L: [{ start: '08:00', end: '09:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Curso C',
    color: getColor(3), // Green
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ L: [{ start: '08:00', end: '09:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Curso D',
    color: getColor(6), // Purple
    groups: [
      {
        name: 'Grupo 1',
        schedule: createSchedule({ L: [{ start: '08:00', end: '09:50' }] }),
        isActive: true,
      },
    ],
    isActive: true,
  },
]

export type SampleCoursesSetType = 'single' | 'multiple' | 'heavy' | 'conflict'

export const datasets = [
  { value: 'single', label: 'Unique Option' },
  { value: 'multiple', label: 'Multiple Options' },
  { value: 'heavy', label: 'Heavy Load' },
  { value: 'conflict', label: 'No solution' },
]

export const getSampleSet = (type: SampleCoursesSetType): Course[] => {
  switch (type) {
    case 'single':
      return sampleCoursesSingleOption
    case 'multiple':
      return sampleCoursesMultipleOptions
    case 'heavy':
      return sampleCoursesHeavy
    case 'conflict':
      return sampleCoursesConflict
  }
}
