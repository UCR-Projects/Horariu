/* eslint-disable @typescript-eslint/naming-convention */
import { generateAllSchedules, generateSchedulesWithLinks } from '../../src/services/ScheduleService'
import type { GenerateScheduleInfo, CourseLink } from '../../src/schemas/schedule.schema'

describe('ScheduleService - generateAllSchedules', () => {
  describe('Basic scenarios', () => {
    it('generates one combination for two courses with no conflict (exact match)', () => {
      const input: GenerateScheduleInfo = [
        {
          name: 'Curso A',
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
            group: {
              name: 'Grupo A1',
              schedule: {
                L: [{ start: '08:00', end: '09:50' }]
              }
            }
          },
          {
            courseName: 'Curso B',
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
            group: {
              name: 'Grupo A1',
              schedule: {
                L: [{ start: '08:00', end: '09:50' }]
              }
            }
          },
          {
            courseName: 'Curso B',
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
            group: {
              name: 'Grupo A2',
              schedule: {
                M: [{ start: '10:00', end: '11:50' }]
              }
            }
          },
          {
            courseName: 'Curso B',
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

describe('ScheduleService - generateSchedulesWithLinks', () => {
  describe('No links', () => {
    it('should behave like generateAllSchedules when no links provided', () => {
      const courses: GenerateScheduleInfo = [
        {
          name: 'Math',
          groups: [
            { name: 'G1', schedule: { L: [{ start: '08:00', end: '09:50' }] } }
          ]
        },
        {
          name: 'Physics',
          groups: [
            { name: 'G1', schedule: { M: [{ start: '08:00', end: '09:50' }] } }
          ]
        }
      ]

      const result = generateSchedulesWithLinks({ courses, links: [] })
      const directResult = generateAllSchedules(courses)

      expect(result).toEqual(directResult)
    })
  })

  describe('Basic linking (2 courses)', () => {
    it('should generate only linked combinations when courses are linked', () => {
      const courses: GenerateScheduleInfo = [
        {
          name: 'Theory',
          groups: [
            { name: 'A', schedule: { L: [{ start: '08:00', end: '09:50' }] } },
            { name: 'B', schedule: { L: [{ start: '10:00', end: '11:50' }] } }
          ]
        },
        {
          name: 'Lab',
          groups: [
            { name: 'A', schedule: { M: [{ start: '08:00', end: '09:50' }] } },
            { name: 'B', schedule: { M: [{ start: '10:00', end: '11:50' }] } }
          ]
        }
      ]

      const links: CourseLink[] = [
        {
          courses: ['Theory', 'Lab'],
          connectionSets: [
            { groups: [{ course: 'Theory', group: 'A' }, { course: 'Lab', group: 'A' }] },
            { groups: [{ course: 'Theory', group: 'B' }, { course: 'Lab', group: 'B' }] }
          ]
        }
      ]

      const result = generateSchedulesWithLinks({ courses, links })

      // Should have 2 schedules: Theory A + Lab A, Theory B + Lab B
      expect(result.length).toBe(2)

      // Each schedule should have 2 courses
      expect(result[0].length).toBe(2)
      expect(result[1].length).toBe(2)

      // Verify correct pairings
      const schedule1Courses = result[0].map(c => `${c.courseName}:${c.group.name}`)
      const schedule2Courses = result[1].map(c => `${c.courseName}:${c.group.name}`)

      expect(schedule1Courses).toContain('Theory:A')
      expect(schedule1Courses).toContain('Lab:A')
      expect(schedule2Courses).toContain('Theory:B')
      expect(schedule2Courses).toContain('Lab:B')
    })

    it('should expand merged courses back with correct schedules', () => {
      const courses: GenerateScheduleInfo = [
        {
          name: 'Theory',
          groups: [
            { name: 'A', schedule: { L: [{ start: '08:00', end: '09:50' }] } }
          ]
        },
        {
          name: 'Lab',
          groups: [
            { name: 'A', schedule: { M: [{ start: '14:00', end: '15:50' }] } }
          ]
        }
      ]

      const links: CourseLink[] = [
        {
          courses: ['Theory', 'Lab'],
          connectionSets: [
            { groups: [{ course: 'Theory', group: 'A' }, { course: 'Lab', group: 'A' }] }
          ]
        }
      ]

      const result = generateSchedulesWithLinks({ courses, links })

      expect(result.length).toBe(1)

      const theory = result[0].find(c => c.courseName === 'Theory')
      const lab = result[0].find(c => c.courseName === 'Lab')

      expect(theory?.group.schedule).toEqual({ L: [{ start: '08:00', end: '09:50' }] })
      expect(lab?.group.schedule).toEqual({ M: [{ start: '14:00', end: '15:50' }] })
    })
  })

  describe('Link with unlinked courses', () => {
    it('should combine linked courses with unlinked courses', () => {
      const courses: GenerateScheduleInfo = [
        {
          name: 'Theory',
          groups: [
            { name: 'A', schedule: { L: [{ start: '08:00', end: '09:50' }] } }
          ]
        },
        {
          name: 'Lab',
          groups: [
            { name: 'A', schedule: { L: [{ start: '10:00', end: '11:50' }] } }
          ]
        },
        {
          name: 'Unlinked',
          groups: [
            { name: 'X', schedule: { M: [{ start: '08:00', end: '09:50' }] } },
            { name: 'Y', schedule: { M: [{ start: '10:00', end: '11:50' }] } }
          ]
        }
      ]

      const links: CourseLink[] = [
        {
          courses: ['Theory', 'Lab'],
          connectionSets: [
            { groups: [{ course: 'Theory', group: 'A' }, { course: 'Lab', group: 'A' }] }
          ]
        }
      ]

      const result = generateSchedulesWithLinks({ courses, links })

      // Should have 2 schedules: (Theory A + Lab A) with Unlinked X or Y
      expect(result.length).toBe(2)

      // Each schedule should have 3 courses
      expect(result[0].length).toBe(3)

      // All schedules should have Theory A and Lab A linked together
      for (const schedule of result) {
        expect(schedule.find(c => c.courseName === 'Theory')?.group.name).toBe('A')
        expect(schedule.find(c => c.courseName === 'Lab')?.group.name).toBe('A')
      }

      // Unlinked course should vary
      const unlinkedGroups = result.map(s => s.find(c => c.courseName === 'Unlinked')?.group.name)
      expect(unlinkedGroups).toContain('X')
      expect(unlinkedGroups).toContain('Y')
    })
  })

  describe('Link conflicts', () => {
    it('should handle conflicts within linked groups (combined schedule)', () => {
      const courses: GenerateScheduleInfo = [
        {
          name: 'Theory',
          groups: [
            { name: 'A', schedule: { L: [{ start: '08:00', end: '09:50' }] } }
          ]
        },
        {
          name: 'Lab',
          groups: [
            { name: 'A', schedule: { L: [{ start: '08:00', end: '09:50' }] } } // Same time as Theory!
          ]
        },
        {
          name: 'Other',
          groups: [
            { name: 'X', schedule: { M: [{ start: '08:00', end: '09:50' }] } }
          ]
        }
      ]

      const links: CourseLink[] = [
        {
          courses: ['Theory', 'Lab'],
          connectionSets: [
            { groups: [{ course: 'Theory', group: 'A' }, { course: 'Lab', group: 'A' }] }
          ]
        }
      ]

      const result = generateSchedulesWithLinks({ courses, links })

      // The merged super-course (Theory|Lab) has schedule on L 08:00-09:50 (combined)
      // This doesn't conflict with "Other" on M, so we should get 1 schedule
      expect(result.length).toBe(1)
    })

    it('should return empty when linked group conflicts with unlinked course', () => {
      const courses: GenerateScheduleInfo = [
        {
          name: 'Theory',
          groups: [
            { name: 'A', schedule: { L: [{ start: '08:00', end: '09:50' }] } }
          ]
        },
        {
          name: 'Lab',
          groups: [
            { name: 'A', schedule: { L: [{ start: '10:00', end: '11:50' }] } }
          ]
        },
        {
          name: 'Other',
          groups: [
            { name: 'X', schedule: { L: [{ start: '08:30', end: '09:30' }] } } // Conflicts with Theory
          ]
        }
      ]

      const links: CourseLink[] = [
        {
          courses: ['Theory', 'Lab'],
          connectionSets: [
            { groups: [{ course: 'Theory', group: 'A' }, { course: 'Lab', group: 'A' }] }
          ]
        }
      ]

      const result = generateSchedulesWithLinks({ courses, links })

      // The merged super-course has L: 08:00-09:50 and 10:00-11:50
      // Other has L: 08:30-09:30 which conflicts with 08:00-09:50
      expect(result.length).toBe(0)
    })
  })

  describe('Multiple links', () => {
    it('should handle multiple independent links', () => {
      const courses: GenerateScheduleInfo = [
        {
          name: 'Math',
          groups: [
            { name: 'A', schedule: { L: [{ start: '08:00', end: '09:50' }] } }
          ]
        },
        {
          name: 'MathLab',
          groups: [
            { name: 'A', schedule: { L: [{ start: '10:00', end: '11:50' }] } }
          ]
        },
        {
          name: 'Physics',
          groups: [
            { name: 'A', schedule: { M: [{ start: '08:00', end: '09:50' }] } }
          ]
        },
        {
          name: 'PhysicsLab',
          groups: [
            { name: 'A', schedule: { M: [{ start: '10:00', end: '11:50' }] } }
          ]
        }
      ]

      const links: CourseLink[] = [
        {
          courses: ['Math', 'MathLab'],
          connectionSets: [
            { groups: [{ course: 'Math', group: 'A' }, { course: 'MathLab', group: 'A' }] }
          ]
        },
        {
          courses: ['Physics', 'PhysicsLab'],
          connectionSets: [
            { groups: [{ course: 'Physics', group: 'A' }, { course: 'PhysicsLab', group: 'A' }] }
          ]
        }
      ]

      const result = generateSchedulesWithLinks({ courses, links })

      // Should get 1 schedule with all 4 courses
      expect(result.length).toBe(1)
      expect(result[0].length).toBe(4)

      const courseNames = result[0].map(c => c.courseName).sort()
      expect(courseNames).toEqual(['Math', 'MathLab', 'Physics', 'PhysicsLab'])
    })
  })

  describe('Partial connection sets', () => {
    it('should handle links where not all groups are connected', () => {
      const courses: GenerateScheduleInfo = [
        {
          name: 'Theory',
          groups: [
            { name: 'A', schedule: { L: [{ start: '08:00', end: '09:50' }] } },
            { name: 'B', schedule: { L: [{ start: '10:00', end: '11:50' }] } },
            { name: 'C', schedule: { L: [{ start: '12:00', end: '13:50' }] } } // Not linked
          ]
        },
        {
          name: 'Lab',
          groups: [
            { name: 'A', schedule: { M: [{ start: '08:00', end: '09:50' }] } },
            { name: 'B', schedule: { M: [{ start: '10:00', end: '11:50' }] } }
          ]
        }
      ]

      const links: CourseLink[] = [
        {
          courses: ['Theory', 'Lab'],
          connectionSets: [
            { groups: [{ course: 'Theory', group: 'A' }, { course: 'Lab', group: 'A' }] },
            { groups: [{ course: 'Theory', group: 'B' }, { course: 'Lab', group: 'B' }] }
            // Note: Theory C is not linked to any Lab group
          ]
        }
      ]

      const result = generateSchedulesWithLinks({ courses, links })

      // Only 2 valid combinations: A+A and B+B (Theory C is orphaned, but handled by merge)
      expect(result.length).toBe(2)
    })
  })

  describe('Link with 3+ courses', () => {
    it('should handle linking more than 2 courses', () => {
      const courses: GenerateScheduleInfo = [
        {
          name: 'Theory',
          groups: [
            { name: 'A', schedule: { L: [{ start: '08:00', end: '09:50' }] } }
          ]
        },
        {
          name: 'Lab1',
          groups: [
            { name: 'A', schedule: { M: [{ start: '08:00', end: '09:50' }] } }
          ]
        },
        {
          name: 'Lab2',
          groups: [
            { name: 'A', schedule: { K: [{ start: '08:00', end: '09:50' }] } }
          ]
        }
      ]

      const links: CourseLink[] = [
        {
          courses: ['Theory', 'Lab1', 'Lab2'],
          connectionSets: [
            {
              groups: [
                { course: 'Theory', group: 'A' },
                { course: 'Lab1', group: 'A' },
                { course: 'Lab2', group: 'A' }
              ]
            }
          ]
        }
      ]

      const result = generateSchedulesWithLinks({ courses, links })

      expect(result.length).toBe(1)
      expect(result[0].length).toBe(3)

      const courseNames = result[0].map(c => c.courseName).sort()
      expect(courseNames).toEqual(['Lab1', 'Lab2', 'Theory'])
    })
  })
})
