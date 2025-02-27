import { Group, Day, Course } from '../../types'
import { validationMessages } from './validationMessages'
type ValidationErrors = {
  name?: string
  groups?: string
  groupSchedules?: { [groupName: string]: string }
}

export const validateCourseNameUnique = (
  name: string,
  existingCourses: Course[],
  currentCourseName?: string
): boolean => {
  const otherCourses = currentCourseName
    ? existingCourses.filter((course) => course.name !== currentCourseName)
    : existingCourses

  return !otherCourses.some((course) => course.name === name)
}

export const validateGroupSchedule = (group: Group): boolean => {
  const days = Object.keys(group.schedule)
  if (days.length === 0) return false

  // Check if all days have valid start and end times
  return days.every((day) => {
    const timeSlot = group.schedule[day as Day]
    return timeSlot && timeSlot.start !== '----' && timeSlot.end !== '----'
  })
}

export const validateGroups = (groups: Group[]): boolean => {
  if (groups.length === 0) return false

  // Check if at least one group has a schedule
  return groups.some((group) => {
    return (
      Object.keys(group.schedule).length > 0 && validateGroupSchedule(group)
    )
  })
}

export const validateCourseForm = (
  formData: { name: string; color: string; groups: Group[] },
  existingCourses: Course[],
  currentCourseName?: string
): ValidationErrors => {
  const errors: ValidationErrors = {}

  // Validate course name
  if (formData.name.trim() === '') {
    errors.name = validationMessages.course.nameRequired
  } else if (
    !validateCourseNameUnique(formData.name, existingCourses, currentCourseName)
  ) {
    errors.name = validationMessages.course.nameNotUnique
  }

  // Validate groups
  if (formData.groups.length === 0) {
    errors.groups = validationMessages.course.noGroups
  } else {
    // Validate each group has at least one day with valid schedule
    const groupScheduleErrors: { [groupName: string]: string } = {}

    formData.groups.forEach((group) => {
      const days = Object.keys(group.schedule)

      if (days.length === 0) {
        groupScheduleErrors[group.name] =
          validationMessages.group.noDaysSelected
      } else {
        // Check if all selected days have valid times
        const hasInvalidTimes = days.some((day) => {
          const timeSlot = group.schedule[day as Day]
          return timeSlot.start === '----' || timeSlot.end === '----'
        })

        if (hasInvalidTimes) {
          groupScheduleErrors[group.name] =
            validationMessages.group.invalidTimes
        }
      }
    })

    if (Object.keys(groupScheduleErrors).length > 0) {
      errors.groupSchedules = groupScheduleErrors
    }
  }

  return errors
}
