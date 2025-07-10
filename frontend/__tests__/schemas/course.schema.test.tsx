import { expect, it, describe, beforeEach, vi } from 'vitest'

import {
  createCourseSchema,
  createGroupSchema,
} from '../../src/validation/schemas/course.schema'

vi.mock('@/stores/useCourseStore', () => ({
  default: {
    getState: vi.fn(() => ({
      courses: [{ name: 'Calculus I', color: 'bg-green-500', groups: [] }],
    })),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('createCourseSchema Validation', () => {
  it('should pass if the course is valid', () => {
    const validCourse = {
      courseName: 'Course 1',
      color: 'bg-green-500',
      groups: [
        {
          name: 'G1',
          schedule: [
            {
              day: 'L',
              active: true,
              startTime: '08:00',
              endTime: '09:30',
            },
          ],
        },
      ],
    }

    const schema = createCourseSchema()
    const result = schema.safeParse(validCourse)
    expect(result.success).toBe(true)
  })

  it('should pass if the course name is the same as the editing course name', () => {
    const editedCourse = {
      courseName: 'Calculus I',
      color: 'bg-green-500',
      groups: [
        {
          name: 'G1',
          schedule: [
            {
              day: 'L',
              active: true,
              startTime: '08:00',
              endTime: '09:30',
            },
          ],
        },
      ],
    }

    const schema = createCourseSchema('Calculus I')
    const result = schema.safeParse(editedCourse)
    expect(result.success).toBe(true)
  })

  it('should fail if the course name is not unique', () => {
    const duplicateCourse = {
      courseName: 'Calculus I',
      color: 'bg-green-500',
      groups: [
        {
          name: 'G1',
          schedule: [
            {
              day: 'L',
              active: true,
              startTime: '08:00',
              endTime: '09:30',
            },
          ],
        },
      ],
    }

    const schema = createCourseSchema()
    const result = schema.safeParse(duplicateCourse)
    expect(result.success).toBe(false)
  })

  it('should fail if the course name is empty', () => {
    const invalidCourse = {
      courseName: '',
      color: 'bg-green-500',
      groups: [
        {
          name: 'G1',
          schedule: [
            {
              day: 'L',
              active: true,
              startTime: '08:00',
              endTime: '09:30',
            },
          ],
        },
      ],
    }

    const schema = createCourseSchema()
    const result = schema.safeParse(invalidCourse)
    expect(result.success).toBe(false)
  })

  it('should fail if the course name is too long (more than 30 characters)', () => {
    const invalidCourse = {
      courseName:
        '............................................................',
      color: 'bg-green-500',
      groups: [
        {
          name: 'G1',
          schedule: [
            {
              day: 'L',
              active: true,
              startTime: '08:00',
              endTime: '09:30',
            },
          ],
        },
      ],
    }

    const schema = createCourseSchema()
    const result = schema.safeParse(invalidCourse)
    expect(result.success).toBe(false)
  })

  it('should fail if does not have any groups', () => {
    const invalidCourse = {
      courseName: 'Course 1',
      color: 'bg-green-500',
      groups: [],
    }
    const schema = createCourseSchema()
    const result = schema.safeParse(invalidCourse)
    expect(result.success).toBe(false)
  })

  it('should fail if any prop is missing', () => {
    const invalidCourse = {
      courseName: 'Course 1',
      color: 'bg-green-500',
    }
    const schema = createCourseSchema()
    const result = schema.safeParse(invalidCourse)
    expect(result.success).toBe(false)
  })
})

//* scheduleItemSchema Validation
// describe('scheduleItemSchema Validation', () => {
//   it('should pass if the schedule is valid', () => {
//     const validScheduleItem = {
//       day: 'L',
//       active: true,
//       startTime: '08:00',
//       endTime: '09:30',
//     }

//     const result = scheduleItemSchema.safeParse(validScheduleItem)
//     expect(result.success).toBe(true)
//   })

//   it('should fail if the day is invalid', () => {
//     const invalidScheduleItem = {
//       day: 'invalidDay',
//       active: true,
//       startTime: '08:00',
//       endTime: '09:30',
//     }

//     const result = scheduleItemSchema.safeParse(invalidScheduleItem)
//     expect(result.success).toBe(false)
//   })

//   it('should fail if a property is missing', () => {
//     const invalidScheduleItem = {
//       day: 'L',
//       active: true,
//     }

//     const result = scheduleItemSchema.safeParse(invalidScheduleItem)
//     expect(result.success).toBe(false)
//   })
// })

//* createCourseSchema Validation
describe('createGroupSchema Validation', () => {
  it('should pass if the group is valid', () => {
    const validGroup = {
      groupName: 'Group 1',
      schedules: [
        {
          day: 'L',
          active: true,
          startTime: '08:00',
          endTime: '09:30',
        },
        {
          day: 'K',
          active: true,
          startTime: '12:00',
          endTime: '09:30',
        },
      ],
    }
    const schema = createGroupSchema()
    const result = schema.safeParse(validGroup)
    expect(result.success).toBe(true)
  })

  it('should pass if the group name is the same as the editing course name', () => {
    const existingGroups = ['Group 1', 'Group 2']
    const editedGroup = {
      groupName: 'Group 1',
      schedules: [
        {
          day: 'L',
          active: true,
          startTime: '08:00',
          endTime: '09:30',
        },
      ],
    }
    const schema = createGroupSchema(existingGroups, 'Group 1')
    const result = schema.safeParse(editedGroup)
    expect(result.success).toBe(true)
  })

  it('should fail if the group name is empty', () => {
    const invalidGroup = {
      groupName: '',
      schedules: [
        {
          day: 'L',
          active: true,
          startTime: '08:00',
          endTime: '09:30',
        },
      ],
    }
    const schema = createGroupSchema()
    const result = schema.safeParse(invalidGroup)
    expect(result.success).toBe(false)
  })

  it('should fail if the group name is too long (more than 25 characters)', () => {
    const invalidGroup = {
      groupName: 'This is a very long group name that should not be valid',
      schedules: [
        {
          day: 'L',
          active: true,
          startTime: '08:00',
          endTime: '09:30',
        },
      ],
    }
    const schema = createGroupSchema()
    const result = schema.safeParse(invalidGroup)
    expect(result.success).toBe(false)
  })

  it('should fail if the group name is not unique', () => {
    const existingGroups = ['Group 1', 'Group 2']
    const invalidGroup = {
      groupName: 'Group 1',
      schedules: [
        {
          day: 'L',
          active: true,
          startTime: '08:00',
          endTime: '09:30',
        },
      ],
    }
    const schema = createGroupSchema(existingGroups)
    const result = schema.safeParse(invalidGroup)
    expect(result.success).toBe(false)
  })

  it('should fail if no day is active', () => {
    const invalidGroup = {
      groupName: 'Group 1',
      schedules: [
        {
          day: 'L',
          active: false,
          startTime: '08:00',
          endTime: '09:30',
        },
        {
          day: 'K',
          active: false,
          startTime: '12:00',
          endTime: '09:30',
        },
      ],
    }
    const schema = createGroupSchema()
    const result = schema.safeParse(invalidGroup)
    expect(result.success).toBe(false)
  })

  // it('should fail if an active schedule has an invalid time range', () => {
  //   const invalidGroup = {
  //     groupName: 'Group 1',
  //     schedules: [
  //       {
  //         day: 'L',
  //         active: true,
  //         startTime: '----',
  //         endTime: '09:30',
  //       },
  //       {
  //         day: 'K',
  //         active: true,
  //         startTime: '12:00',
  //         endTime: '----',
  //       },
  //     ],
  //   }
  //   const schema = createGroupSchema()
  //   const result = schema.safeParse(invalidGroup)
  //   expect(result.success).toBe(false)
  // })
})
