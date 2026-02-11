import { expect, it, describe } from 'vitest'

import { createCourseSchema, createGroupSchema } from '../../src/validation/schemas/course.schema'

// Existing course names for testing uniqueness validation
const existingCourseNames = ['Calculus I']

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
              timeBlocks: [
                {
                  start: '08:00',
                  end: '09:30',
                },
              ],
            },
          ],
          isActive: true,
        },
      ],
    }

    const schema = createCourseSchema(existingCourseNames)
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
              timeBlocks: [
                {
                  start: '08:00',
                  end: '09:30',
                },
              ],
            },
          ],
          isActive: true,
        },
      ],
    }

    const schema = createCourseSchema(existingCourseNames, 'Calculus I')
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
              timeBlocks: [
                {
                  start: '08:00',
                  end: '09:30',
                },
              ],
            },
          ],
          isActive: true,
        },
      ],
    }

    const schema = createCourseSchema(existingCourseNames)
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
              timeBlocks: [
                {
                  start: '08:00',
                  end: '09:30',
                },
              ],
            },
          ],
          isActive: true,
        },
      ],
    }

    const schema = createCourseSchema(existingCourseNames)
    const result = schema.safeParse(invalidCourse)
    expect(result.success).toBe(false)
  })

  it('should fail if the course name is too long (more than 30 characters)', () => {
    const invalidCourse = {
      courseName: '............................................................',
      color: 'bg-green-500',
      groups: [
        {
          name: 'G1',
          schedule: [
            {
              day: 'L',
              active: true,
              timeBlocks: [
                {
                  start: '08:00',
                  end: '09:30',
                },
              ],
            },
          ],
          isActive: true,
        },
      ],
    }

    const schema = createCourseSchema(existingCourseNames)
    const result = schema.safeParse(invalidCourse)
    expect(result.success).toBe(false)
  })

  it('should fail if does not have any groups', () => {
    const invalidCourse = {
      courseName: 'Course 1',
      color: 'bg-green-500',
      groups: [],
    }
    const schema = createCourseSchema(existingCourseNames)
    const result = schema.safeParse(invalidCourse)
    expect(result.success).toBe(false)
  })

  it('should fail if any prop is missing', () => {
    const invalidCourse = {
      courseName: 'Course 1',
      color: 'bg-green-500',
    }
    const schema = createCourseSchema(existingCourseNames)
    const result = schema.safeParse(invalidCourse)
    expect(result.success).toBe(false)
  })
})

describe('createGroupSchema Validation', () => {
  it('should pass if the group is valid', () => {
    const validGroup = {
      groupName: 'Group 1',
      schedules: [
        {
          day: 'L',
          active: true,
          timeBlocks: [
            {
              start: '08:00',
              end: '09:30',
            },
          ],
        },
        {
          day: 'K',
          active: true,
          timeBlocks: [
            {
              start: '12:00',
              end: '13:30',
            },
          ],
        },
      ],
    }
    const schema = createGroupSchema()
    const result = schema.safeParse(validGroup)
    expect(result.success).toBe(true)
  })

  it('should pass if the group has multiple time blocks without overlap', () => {
    const validGroup = {
      groupName: 'Group 1',
      schedules: [
        {
          day: 'L',
          active: true,
          timeBlocks: [
            {
              start: '08:00',
              end: '09:30',
            },
            {
              start: '10:00',
              end: '11:30',
            },
          ],
        },
      ],
    }
    const schema = createGroupSchema()
    const result = schema.safeParse(validGroup)
    expect(result.success).toBe(true)
  })

  it('should pass if the group name is the same as the editing group name', () => {
    const existingGroups = ['Group 1', 'Group 2']
    const editedGroup = {
      groupName: 'Group 1',
      schedules: [
        {
          day: 'L',
          active: true,
          timeBlocks: [
            {
              start: '08:00',
              end: '09:30',
            },
          ],
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
          timeBlocks: [
            {
              start: '08:00',
              end: '09:30',
            },
          ],
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
          timeBlocks: [
            {
              start: '08:00',
              end: '09:30',
            },
          ],
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
          timeBlocks: [
            {
              start: '08:00',
              end: '09:30',
            },
          ],
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
          timeBlocks: [
            {
              start: '08:00',
              end: '09:30',
            },
          ],
        },
        {
          day: 'K',
          active: false,
          timeBlocks: [
            {
              start: '12:00',
              end: '13:30',
            },
          ],
        },
      ],
    }
    const schema = createGroupSchema()
    const result = schema.safeParse(invalidGroup)
    expect(result.success).toBe(false)
  })

  it('should fail if an active schedule has an invalid time range', () => {
    const invalidGroup = {
      groupName: 'Group 1',
      schedules: [
        {
          day: 'L',
          active: true,
          timeBlocks: [
            {
              start: '----',
              end: '09:30',
            },
          ],
        },
        {
          day: 'K',
          active: true,
          timeBlocks: [
            {
              start: '12:00',
              end: '----',
            },
          ],
        },
      ],
    }
    const schema = createGroupSchema()
    const result = schema.safeParse(invalidGroup)
    expect(result.success).toBe(false)
  })

  it('should fail if time blocks overlap within a day', () => {
    const invalidGroup = {
      groupName: 'Group 1',
      schedules: [
        {
          day: 'L',
          active: true,
          timeBlocks: [
            {
              start: '08:00',
              end: '10:00',
            },
            {
              start: '09:30',
              end: '11:00',
            },
          ],
        },
      ],
    }
    const schema = createGroupSchema()
    const result = schema.safeParse(invalidGroup)
    expect(result.success).toBe(false)
  })

  it('should pass if time blocks touch but do not overlap', () => {
    const validGroup = {
      groupName: 'Group 1',
      schedules: [
        {
          day: 'L',
          active: true,
          timeBlocks: [
            {
              start: '08:00',
              end: '09:30',
            },
            {
              start: '09:30',
              end: '11:00',
            },
          ],
        },
      ],
    }
    const schema = createGroupSchema()
    const result = schema.safeParse(validGroup)
    expect(result.success).toBe(true)
  })

  it('should pass if inactive schedules have invalid time ranges', () => {
    const validGroup = {
      groupName: 'Group 1',
      schedules: [
        {
          day: 'L',
          active: true,
          timeBlocks: [
            {
              start: '08:00',
              end: '09:30',
            },
          ],
        },
        {
          day: 'K',
          active: false,
          timeBlocks: [
            {
              start: '----',
              end: '----',
            },
          ],
        },
      ],
    }
    const schema = createGroupSchema()
    const result = schema.safeParse(validGroup)
    expect(result.success).toBe(true)
  })

  it('should pass if inactive schedules have overlapping time blocks', () => {
    const validGroup = {
      groupName: 'Group 1',
      schedules: [
        {
          day: 'L',
          active: true,
          timeBlocks: [
            {
              start: '08:00',
              end: '09:30',
            },
          ],
        },
        {
          day: 'K',
          active: false,
          timeBlocks: [
            {
              start: '08:00',
              end: '10:00',
            },
            {
              start: '09:30',
              end: '11:00',
            },
          ],
        },
      ],
    }
    const schema = createGroupSchema()
    const result = schema.safeParse(validGroup)
    expect(result.success).toBe(true)
  })
})
