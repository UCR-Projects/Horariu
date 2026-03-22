import { timeSlotSchema, scheduleSchema, groupSchema, courseSchema, generateScheduleSchema, allCoursesSchema } from '../../src/schemas/schedule.schema'

/* eslint-disable @typescript-eslint/naming-convention */
describe('Time Slot Schema Validation', () => {
  it('should validate a correct time slot', () => {
    const result = timeSlotSchema.safeParse({
      start: '08:30',
      end: '10:00'
    })
    expect(result.success).toBe(true)
  })

  it('should fail if start time is in incorrect format', () => {
    const result = timeSlotSchema.safeParse({
      start: '8:30',
      end: '10:00'
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().start?._errors).toContain('Start time must be in HH:mm format')
    }
  })

  it('should fail if end time is in incorrect format', () => {
    const result = timeSlotSchema.safeParse({
      start: '08:30',
      end: '25:00'
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().end?._errors).toContain('End time must be in HH:mm format')
    }
  })
})

describe('Schedule Schema Validation', () => {
  it('should validate a correct schedule', () => {
    const result = scheduleSchema.safeParse({
      L: [{ start: '08:00', end: '10:00' }],
      M: [{ start: '14:00', end: '16:00' }]
    })
    expect(result.success).toBe(true)
  })

  it('should fail if a day key is longer than one character', () => {
    const result = scheduleSchema.safeParse({
      Monday: [{ start: '08:00', end: '10:00' }]
    })
    expect(result.success).toBe(false)
  })

  it('should fail if a time slot is invalid', () => {
    const result = scheduleSchema.safeParse({
      L: [{ start: '08:60', end: '10:00' }]
    })
    expect(result.success).toBe(false)
  })
})

describe('Group Schema Validation', () => {
  it('should validate a correct group', () => {
    const result = groupSchema.safeParse({
      name: 'Group A',
      schedule: {
        L: [{ start: '09:00', end: '11:00' }]
      }
    })
    expect(result.success).toBe(true)
  })

  it('should fail if group name is empty', () => {
    const result = groupSchema.safeParse({
      name: '',
      schedule: {
        L: [{ start: '09:00', end: '11:00' }]
      }
    })
    expect(result.success).toBe(false)
  })

  it('should fail if schedule is empty', () => {
    const result = groupSchema.safeParse({
      name: 'Group B',
      schedule: {}
    })
    expect(result.success).toBe(false)
  })
})

describe('Course Schema Validation', () => {
  it('should validate a correct course', () => {
    const result = courseSchema.safeParse({
      name: 'Mathematics 101',
      groups: [
        {
          name: 'Group A',
          schedule: { L: [{ start: '08:00', end: '10:00' }] }
        }
      ]
    })
    expect(result.success).toBe(true)
  })

  it('should fail if course name is empty', () => {
    const result = courseSchema.safeParse({
      name: '',
      groups: [
        {
          name: 'Group A',
          schedule: { L: [{ start: '08:00', end: '10:00' }] }
        }
      ]
    })
    expect(result.success).toBe(false)
  })

  it('should fail if no groups are provided', () => {
    const result = courseSchema.safeParse({
      name: 'Physics 101',
      groups: []
    })
    expect(result.success).toBe(false)
  })
})

describe('Generate Schedule Schema Validation', () => {
  it('should validate a correct schedule generation with courses and links', () => {
    const result = generateScheduleSchema.safeParse({
      courses: [
        {
          name: 'Mathematics 101',
          groups: [
            {
              name: 'Group A',
              schedule: { M: [{ start: '09:00', end: '11:00' }] }
            }
          ]
        }
      ],
      links: []
    })
    expect(result.success).toBe(true)
  })

  it('should fail if no courses are provided', () => {
    const result = generateScheduleSchema.safeParse({
      courses: [],
      links: []
    })
    expect(result.success).toBe(false)
  })

  it('should validate links with connection sets', () => {
    const result = generateScheduleSchema.safeParse({
      courses: [
        {
          name: 'Chemistry',
          groups: [{ name: 'G1', schedule: { L: [{ start: '08:00', end: '10:00' }] } }]
        },
        {
          name: 'Chemistry Lab',
          groups: [{ name: 'G1', schedule: { M: [{ start: '10:00', end: '12:00' }] } }]
        }
      ],
      links: [
        {
          courses: ['Chemistry', 'Chemistry Lab'],
          connectionSets: [
            { groups: [{ course: 'Chemistry', group: 'G1' }, { course: 'Chemistry Lab', group: 'G1' }] }
          ]
        }
      ]
    })
    expect(result.success).toBe(true)
  })
})

describe('All Courses Schema Validation', () => {
  it('should validate correct course data without color', () => {
    const result = allCoursesSchema.safeParse([
      {
        courseName: 'Computer Science 101',
        group: {
          name: 'Group C',
          schedule: { V: [{ start: '14:00', end: '16:00' }] }
        }
      }
    ])
    expect(result.success).toBe(true)
  })

  it('should fail if courseName is missing', () => {
    const result = allCoursesSchema.safeParse([
      {
        group: {
          name: 'Group D',
          schedule: { S: [{ start: '12:00', end: '14:00' }] }
        }
      }
    ])
    expect(result.success).toBe(false)
  })
})
