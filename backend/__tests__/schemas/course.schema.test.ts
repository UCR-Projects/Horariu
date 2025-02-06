import { courseSchema, courseParamsSchema, updateCourseSchema, courseDetailsSchema } from '../../src/schemas/course.schema'

describe('Course Schema Validation', () => {
  it('should validate a correct course', () => {
    const result = courseSchema.safeParse({
      courseName: 'Mathematics 101',
      day: 'Lunes',
      startTime: '08:00:00',
      endTime: '10:00:00',
      groupNumber: 1,
      courseDetails: {
        professor: 'John Doe',
        courseCode: 'MATH101',
        classroom: 'Room 12',
        building: 'CS'
      }
    })
    expect(result.success).toBe(true)
  })

  it('should fail if courseName is missing', () => {
    const result = courseSchema.safeParse({
      day: 'Martes',
      startTime: '09:00:00',
      endTime: '11:00:00',
      groupNumber: 2
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().courseName?._errors).toContain('Course name is required')
    }
  })

  it('should fail if day is invalid', () => {
    const result = courseSchema.safeParse({
      courseName: 'Physics 101',
      day: 'Lundi',
      startTime: '10:00:00',
      endTime: '12:00:00',
      groupNumber: 3
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().day?._errors).toContain(
        "Invalid enum value. Expected 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo', received 'Lundi'"
      )
    }
  })

  it('should fail if startTime is in the wrong format', () => {
    const result = courseSchema.safeParse({
      courseName: 'History 101',
      day: 'Miércoles',
      startTime: '10:00',
      endTime: '12:00:00',
      groupNumber: 1
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().startTime?._errors).toContain(
        'Start time must be in the format HH:mm:ss'
      )
    }
  })

  it('should fail if groupNumber is less than 1', () => {
    const result = courseSchema.safeParse({
      courseName: 'Biology 101',
      day: 'Jueves',
      startTime: '11:00:00',
      endTime: '13:00:00',
      groupNumber: 0
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().groupNumber?._errors).toContain(
        'Group number must be at least 1'
      )
    }
  })
})

describe('Course Params Schema Validation', () => {
  it('should validate correct course params', () => {
    const result = courseParamsSchema.safeParse({
      courseName: 'Physics 101',
      day: 'Viernes',
      startTime: '14:00:00',
      groupNumber: '2'
    })
    expect(result.success).toBe(true)
  })

  it('should fail if courseName is empty', () => {
    const result = courseParamsSchema.safeParse({
      courseName: '',
      day: 'Sábado',
      startTime: '15:00:00',
      groupNumber: 3
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().courseName?._errors).toContain('Course name cannot be empty')
    }
  })
})

describe('Update Course Schema Validation', () => {
  it('should validate an empty update object', () => {
    const result = updateCourseSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('should validate partial course updates', () => {
    const result = updateCourseSchema.safeParse({
      courseName: 'Advanced Mathematics',
      groupNumber: 5
    })
    expect(result.success).toBe(true)
  })
})

describe('Course Details Schema Validation', () => {
  it('should validate correct course details', () => {
    const result = courseDetailsSchema.safeParse({
      professor: 'Dr. Smith',
      courseCode: 'CHEM202',
      classroom: 'Lab A',
      building: 'FQ'
    })
    expect(result.success).toBe(true)
  })

  it('should fail if courseCode exceeds max length', () => {
    const result = courseDetailsSchema.safeParse({
      courseCode: '123456789012345678901'
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().courseCode?._errors).toContain('Course code cannot exceed 20 characters')
    }
  })
})
