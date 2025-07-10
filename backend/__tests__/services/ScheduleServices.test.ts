/* eslint-disable @typescript-eslint/naming-convention */
import { generateAllSchedules } from '../../src/services/ScheduleService'
import type { GenerateScheduleInfo } from '../../src/schemas/schedule.schema'

describe('ScheduleService - generateAllSchedules', () => {
  describe('Basic scenarios', () => {
    it('generates one combination for two courses with no conflict (exact match)', () => {
      const input: GenerateScheduleInfo = [
        {
          name: 'Curso A',
          color: 'bg-red-500',
          groups: [
            {
              name: 'Grupo A1',
              schedule: {
                L: [{ start: '08:00', end: '09:50' }]
              }
            }
          ]
        },
        {
          name: 'Curso B',
          color: 'bg-blue-500',
          groups: [
            {
              name: 'Grupo B1',
              schedule: {
                M: [{ start: '10:00', end: '11:50' }]
              }
            }
          ]
        }
      ]

      const expected = [
        [
          {
            courseName: 'Curso A',
            color: 'bg-red-500',
            group: {
              name: 'Grupo A1',
              schedule: {
                L: [{ start: '08:00', end: '09:50' }]
              }
            }
          },
          {
            courseName: 'Curso B',
            color: 'bg-blue-500',
            group: {
              name: 'Grupo B1',
              schedule: {
                M: [{ start: '10:00', end: '11:50' }]
              }
            }
          }
        ]
      ]

      const result = generateAllSchedules(input)
      expect(result).toEqual(expected)
    })

    it('generates two combinations for two groups and one course without conflicts (exact match)', () => {
      const input: GenerateScheduleInfo = [
        {
          name: 'Curso A',
          color: 'bg-red-500',
          groups: [
            {
              name: 'Grupo A1',
              schedule: {
                L: [{ start: '08:00', end: '09:50' }]
              }
            },
            {
              name: 'Grupo A2',
              schedule: {
                M: [{ start: '10:00', end: '11:50' }]
              }
            }
          ]
        },
        {
          name: 'Curso B',
          color: 'bg-blue-500',
          groups: [
            {
              name: 'Grupo B1',
              schedule: {
                K: [{ start: '13:00', end: '14:50' }]
              }
            }
          ]
        }
      ]

      const expected = [
        [
          {
            courseName: 'Curso A',
            color: 'bg-red-500',
            group: {
              name: 'Grupo A1',
              schedule: {
                L: [{ start: '08:00', end: '09:50' }]
              }
            }
          },
          {
            courseName: 'Curso B',
            color: 'bg-blue-500',
            group: {
              name: 'Grupo B1',
              schedule: {
                K: [{ start: '13:00', end: '14:50' }]
              }
            }
          }
        ],
        [
          {
            courseName: 'Curso A',
            color: 'bg-red-500',
            group: {
              name: 'Grupo A2',
              schedule: {
                M: [{ start: '10:00', end: '11:50' }]
              }
            }
          },
          {
            courseName: 'Curso B',
            color: 'bg-blue-500',
            group: {
              name: 'Grupo B1',
              schedule: {
                K: [{ start: '13:00', end: '14:50' }]
              }
            }
          }
        ]
      ]

      const result = generateAllSchedules(input)
      expect(result).toEqual(expected)
    })
  })

  describe('Multiple intervals', () => {
    it('generates one combination with multiple intervals in one group without conflicts (exact match)', () => {
      const input: GenerateScheduleInfo = [
        {
          name: 'Curso A',
          color: 'bg-red-500',
          groups: [
            {
              name: 'Grupo A1',
              schedule: {
                L: [
                  { start: '08:00', end: '09:50' },
                  { start: '13:00', end: '14:50' }
                ]
              }
            }
          ]
        },
        {
          name: 'Curso B',
          color: 'bg-blue-500',
          groups: [
            {
              name: 'Grupo B1',
              schedule: {
                M: [{ start: '10:00', end: '11:50' }]
              }
            }
          ]
        }
      ]

      const expected = [
        [
          {
            courseName: 'Curso A',
            color: 'bg-red-500',
            group: {
              name: 'Grupo A1',
              schedule: {
                L: [
                  { start: '08:00', end: '09:50' },
                  { start: '13:00', end: '14:50' }
                ]
              }
            }
          },
          {
            courseName: 'Curso B',
            color: 'bg-blue-500',
            group: {
              name: 'Grupo B1',
              schedule: {
                M: [{ start: '10:00', end: '11:50' }]
              }
            }
          }
        ]
      ]

      const result = generateAllSchedules(input)
      expect(result).toEqual(expected)
    })

    it('generates two combinations for multiple intervals and groups without conflicts (exact match)', () => {
      const input: GenerateScheduleInfo = [
        {
          name: 'Curso A',
          color: 'bg-red-500',
          groups: [
            {
              name: 'Grupo A1',
              schedule: {
                L: [
                  { start: '07:00', end: '08:50' },
                  { start: '13:00', end: '14:50' }
                ]
              }
            },
            {
              name: 'Grupo A2',
              schedule: {
                L: [
                  { start: '08:00', end: '09:50' },
                  { start: '14:00', end: '15:50' }
                ]
              }
            }
          ]
        },
        {
          name: 'Curso B',
          color: 'bg-green-500',
          groups: [
            {
              name: 'Grupo B1',
              schedule: {
                M: [{ start: '10:00', end: '11:50' }]
              }
            }
          ]
        }
      ]

      const expected = [
        [
          {
            courseName: 'Curso A',
            color: 'bg-red-500',
            group: {
              name: 'Grupo A1',
              schedule: {
                L: [
                  { start: '07:00', end: '08:50' },
                  { start: '13:00', end: '14:50' }
                ]
              }
            }
          },
          {
            courseName: 'Curso B',
            color: 'bg-green-500',
            group: {
              name: 'Grupo B1',
              schedule: {
                M: [{ start: '10:00', end: '11:50' }]
              }
            }
          }
        ],
        [
          {
            courseName: 'Curso A',
            color: 'bg-red-500',
            group: {
              name: 'Grupo A2',
              schedule: {
                L: [
                  { start: '08:00', end: '09:50' },
                  { start: '14:00', end: '15:50' }
                ]
              }
            }
          },
          {
            courseName: 'Curso B',
            color: 'bg-green-500',
            group: {
              name: 'Grupo B1',
              schedule: {
                M: [{ start: '10:00', end: '11:50' }]
              }
            }
          }
        ]
      ]

      const result = generateAllSchedules(input)
      expect(result).toEqual(expected)
    })
  })

  describe('Conflicts', () => {
    it('generates no combinations if all groups conflict (exact match)', () => {
      const input: GenerateScheduleInfo = [
        {
          name: 'Curso A',
          color: 'bg-red-500',
          groups: [
            {
              name: 'Grupo A1',
              schedule: {
                L: [{ start: '08:00', end: '09:50' }]
              }
            }
          ]
        },
        {
          name: 'Curso B',
          color: 'bg-blue-500',
          groups: [
            {
              name: 'Grupo B1',
              schedule: {
                L: [{ start: '09:00', end: '10:50' }]
              }
            }
          ]
        }
      ]

      const expected: [] = []

      const result = generateAllSchedules(input)
      expect(result).toEqual(expected)
    })

    it('generates no combinations if multiple intervals conflict with another course (exact match)', () => {
      const input: GenerateScheduleInfo = [
        {
          name: 'Curso A',
          color: 'bg-red-500',
          groups: [
            {
              name: 'Grupo A1',
              schedule: {
                L: [
                  { start: '08:00', end: '09:50' },
                  { start: '09:00', end: '10:50' }
                ]
              }
            }
          ]
        },
        {
          name: 'Curso B',
          color: 'bg-blue-500',
          groups: [
            {
              name: 'Grupo B1',
              schedule: {
                L: [{ start: '09:30', end: '11:50' }]
              }
            }
          ]
        }
      ]

      const expected: [] = []

      const result = generateAllSchedules(input)
      expect(result).toEqual(expected)
    })
  })

  describe('ScheduleService - generateAllSchedules (snapshot test)', () => {
    it('should generate 48 combinations with no conflicts and match snapshot', () => {
      const input: GenerateScheduleInfo = [
        {
          name: 'Curso 1',
          color: 'bg-red-500',
          groups: [
            {
              name: 'Grupo 1A',
              schedule: { L: [{ start: '08:00', end: '09:50' }] }
            },
            {
              name: 'Grupo 1B',
              schedule: { L: [{ start: '10:00', end: '11:50' }] }
            }
          ]
        },
        {
          name: 'Curso 2',
          color: 'bg-blue-500',
          groups: [
            {
              name: 'Grupo 2A',
              schedule: { M: [{ start: '08:00', end: '09:50' }] }
            },
            {
              name: 'Grupo 2B',
              schedule: { M: [{ start: '10:00', end: '11:50' }] }
            }
          ]
        },
        {
          name: 'Curso 3',
          color: 'bg-green-500',
          groups: [
            {
              name: 'Grupo 3A',
              schedule: { K: [{ start: '08:00', end: '09:50' }] }
            },
            {
              name: 'Grupo 3B',
              schedule: { K: [{ start: '10:00', end: '11:50' }] }
            }
          ]
        },
        {
          name: 'Curso 4',
          color: 'bg-yellow-500',
          groups: [
            {
              name: 'Grupo 4A',
              schedule: { J: [{ start: '08:00', end: '09:50' }] }
            },
            {
              name: 'Grupo 4B',
              schedule: { J: [{ start: '10:00', end: '11:50' }] }
            }
          ]
        },
        {
          name: 'Curso 5',
          color: 'bg-purple-500',
          groups: [
            {
              name: 'Grupo 5A',
              schedule: {
                V: [
                  { start: '08:00', end: '09:50' },
                  { start: '13:00', end: '14:50' }
                ]
              }
            },
            {
              name: 'Grupo 5B',
              schedule: { V: [{ start: '10:00', end: '11:50' }] }
            },
            {
              name: 'Grupo 5C',
              schedule: { V: [{ start: '12:00', end: '13:50' }] }
            }
          ]
        }
      ]

      const result = generateAllSchedules(input)

      expect(result.length).toBe(48)

      expect(result).toMatchSnapshot()
    })
  })
})
