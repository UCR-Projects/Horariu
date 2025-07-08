/* eslint-disable indent */
import { Course } from '@/types'
import { COLORS } from '@/utils/constants'

export const sampleCoursesSingleOption: Course[] = [
  {
    name: 'Matemáticas',
    color: COLORS[8].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { L: { start: '08:00', end: '09:50' } },
      },
    ],
    isActive: true,
  },
  {
    name: 'Historia',
    color: COLORS[9].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { M: { start: '10:00', end: '11:50' } },
      },
    ],
    isActive: true,
  },
  {
    name: 'Literatura',
    color: COLORS[10].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { K: { start: '12:00', end: '13:50' } },
      },
    ],
    isActive: true,
  },
  {
    name: 'Biología',
    color: COLORS[11].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { J: { start: '14:00', end: '15:50' } },
      },
    ],
    isActive: true,
  },
]

export const sampleCoursesMultipleOptions: Course[] = [
  {
    name: 'Programación I',
    color: COLORS[4].value,
    groups: [
      {
        name: 'Grupo A',
        schedule: {
          L: { start: '08:00', end: '09:50' },
          M: { start: '08:00', end: '09:50' },
        },
      },
      {
        name: 'Grupo B',
        schedule: {
          M: { start: '10:00', end: '11:50' },
          K: { start: '10:00', end: '11:50' },
        },
      },
    ],
    isActive: true,
  },
  {
    name: 'Estructuras de Datos',
    color: COLORS[5].value,
    groups: [
      {
        name: 'Grupo A',
        schedule: { M: { start: '11:00', end: '12:50' } },
      },
      {
        name: 'Grupo B',
        schedule: { J: { start: '12:00', end: '13:50' } },
      },
    ],
    isActive: true,
  },
  {
    name: 'Bases de Datos',
    color: COLORS[6].value,
    groups: [
      {
        name: 'Grupo A',
        schedule: { K: { start: '14:00', end: '15:50' } },
      },
      {
        name: 'Grupo B',
        schedule: { V: { start: '14:00', end: '15:50' } },
      },
    ],
    isActive: true,
  },
  {
    name: 'Sistemas Operativos',
    color: COLORS[7].value,
    groups: [
      {
        name: 'Grupo A',
        schedule: { J: { start: '15:00', end: '16:50' } },
      },
      {
        name: 'Grupo B',
        schedule: { V: { start: '16:00', end: '17:50' } },
      },
    ],
    isActive: true,
  },
]

export const sampleCoursesHeavy: Course[] = [
  {
    name: 'Cálculo Avanzado',
    color: COLORS[8].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: {
          L: { start: '08:00', end: '09:50' },
          M: { start: '08:00', end: '09:50' },
        },
      },
      {
        name: 'Grupo 2',
        schedule: {
          M: { start: '10:00', end: '11:50' },
          J: { start: '10:00', end: '11:50' },
        },
      },
      {
        name: 'Grupo 3',
        schedule: {
          K: { start: '12:00', end: '13:50' },
          V: { start: '12:00', end: '15:50' },
        },
      },
    ],
    isActive: true,
  },
  {
    name: 'Física II',
    color: COLORS[20].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { L: { start: '14:00', end: '15:50' } },
      },
      {
        name: 'Grupo 2',
        schedule: { M: { start: '15:00', end: '16:50' } },
      },
    ],
    isActive: true,
  },
  {
    name: 'Química Orgánica',
    color: COLORS[19].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { J: { start: '16:00', end: '17:50' } },
      },
      {
        name: 'Grupo 2',
        schedule: { V: { start: '17:00', end: '18:50' } },
      },
    ],
    isActive: true,
  },
  {
    name: 'Economía',
    color: COLORS[18].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { L: { start: '18:00', end: '19:50' } },
      },
      {
        name: 'Grupo 2',
        schedule: { K: { start: '19:00', end: '20:50' } },
      },
    ],
    isActive: true,
  },
  {
    name: 'Historia del Arte',
    color: COLORS[17].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { M: { start: '20:00', end: '21:50' } },
      },
      {
        name: 'Grupo 2',
        schedule: { J: { start: '21:00', end: '22:50' } },
      },
    ],
    isActive: true,
  },
  {
    name: 'Literatura Contemporánea',
    color: COLORS[16].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { V: { start: '19:00', end: '20:50' } },
      },
      {
        name: 'Grupo 2',
        schedule: { L: { start: '20:00', end: '21:50' } },
      },
    ],
    isActive: true,
  },
]

export const sampleCoursesConflict: Course[] = [
  {
    name: 'Curso A',
    color: COLORS[8].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { L: { start: '08:00', end: '09:50' } },
      },
    ],
    isActive: true,
  },
  {
    name: 'Curso B',
    color: COLORS[9].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { L: { start: '08:00', end: '09:50' } },
      },
    ],
    isActive: true,
  },
  {
    name: 'Curso C',
    color: COLORS[10].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { L: { start: '08:00', end: '09:50' } },
      },
    ],
    isActive: true,
  },
  {
    name: 'Curso D',
    color: COLORS[11].value,
    groups: [
      {
        name: 'Grupo 1',
        schedule: { L: { start: '08:00', end: '09:50' } },
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
