import type { GenerateScheduleInfo, TimeSlot, CurrentSchedule, Group, AllCourses } from '../schemas/schedule.schema'

function timeToMinutes (timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

function hasTimeConflict (slot1: TimeSlot, slot2: TimeSlot): boolean {
  const start1 = timeToMinutes(slot1.start)
  const end1 = timeToMinutes(slot1.end)
  const start2 = timeToMinutes(slot2.start)
  const end2 = timeToMinutes(slot2.end)

  return (start1 < end2 && start2 < end1)
}

function hasConflict (currentSchedule: CurrentSchedule, group: Group): boolean {
  for (const day in group.schedule) {
    const newTimeSlot = group.schedule[day]

    for (const selectedGroup of currentSchedule) {
      const existingGroup = selectedGroup.group
      if (existingGroup.schedule[day]) {
        const existingTimeSlot = existingGroup.schedule[day]
        if (hasTimeConflict(newTimeSlot, existingTimeSlot)) {
          return true
        }
      }
    }
  }
  return false
}

export function generateAllSchedules (courses: GenerateScheduleInfo): AllCourses[] {
  const allSchedules: AllCourses[] = []

  function backtrack (currentSchedule: CurrentSchedule, courseIndex: number) {
    if (courseIndex >= courses.length) {
      allSchedules.push([...currentSchedule])
      return
    }

    const currentCourse = courses[courseIndex]
    for (const group of currentCourse.groups) {
      if (!hasConflict(currentSchedule, group)) {
        currentSchedule.push({
          courseName: currentCourse.name,
          color: currentCourse.color,
          group
        })

        backtrack(currentSchedule, courseIndex + 1)

        currentSchedule.pop()
      }
    }
  }

  backtrack([], 0)
  return allSchedules
}
