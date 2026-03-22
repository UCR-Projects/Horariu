import type { GenerateScheduleInfo, TimeSlot, CurrentSchedule, Group, AllCourses, CourseLink } from '../schemas/schedule.schema'

// Types for pre/post processing
interface ScheduleLookup {
  [key: string]: Record<string, TimeSlot[]> // "CourseName:GroupName" -> schedule
}

interface PreProcessResult {
  courses: GenerateScheduleInfo
  lookup: ScheduleLookup
}

function timeToMinutes (timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Pre-processing: Merge linked courses into "super-courses"
 * Each connection set becomes a single group with combined schedules
 */
function mergeLinkedCourses (
  courses: GenerateScheduleInfo,
  links: CourseLink[]
): PreProcessResult {
  const lookup: ScheduleLookup = {}
  const linkedCourseNames = new Set(links.flatMap(l => l.courses))

  // Store all original schedules in lookup
  for (const course of courses) {
    for (const group of course.groups) {
      lookup[`${course.name}:${group.name}`] = group.schedule
    }
  }

  // Separate unlinked courses
  const unlinkedCourses = courses.filter(c => !linkedCourseNames.has(c.name))

  // Create merged courses for each link
  const mergedCourses = links.map(link => {
    const mergedName = link.courses.join('|')
    const mergedGroups = link.connectionSets.map(cs => {
      const groupName = cs.groups.map(g => `${g.course}:${g.group}`).join('|')
      const mergedSchedule: Record<string, TimeSlot[]> = {}

      // Union all schedules from the connection set
      for (const g of cs.groups) {
        const schedule = lookup[`${g.course}:${g.group}`]
        if (schedule) {
          for (const day in schedule) {
            if (!mergedSchedule[day]) mergedSchedule[day] = []
            mergedSchedule[day].push(...schedule[day])
          }
        }
      }

      return { name: groupName, schedule: mergedSchedule }
    })

    return { name: mergedName, groups: mergedGroups }
  })

  return {
    courses: [...unlinkedCourses, ...mergedCourses],
    lookup
  }
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
    const newTimeSlots = group.schedule[day]

    for (const selectedGroup of currentSchedule) {
      const existingGroup = selectedGroup.group

      if (existingGroup.schedule[day]) {
        const existingTimeSlots = existingGroup.schedule[day]

        for (const newSlot of newTimeSlots) {
          for (const existingSlot of existingTimeSlots) {
            if (hasTimeConflict(newSlot, existingSlot)) {
              return true
            }
          }
        }
      }
    }
  }
  return false
}

/**
 * Post-processing: Expand merged courses back to individual entries
 */
function expandMergedResults (
  schedules: AllCourses[],
  lookup: ScheduleLookup
): AllCourses[] {
  return schedules.map(schedule => {
    const expanded: AllCourses = []

    for (const entry of schedule) {
      if (entry.courseName.includes('|')) {
        // Merged course - expand it back to individual courses
        const groupParts = entry.group.name.split('|')

        for (const part of groupParts) {
          const [courseName, groupName] = part.split(':')
          const originalSchedule = lookup[part]

          expanded.push({
            courseName,
            group: {
              name: groupName,
              schedule: originalSchedule
            }
          })
        }
      } else {
        // Regular course - pass through unchanged
        expanded.push(entry)
      }
    }

    return expanded
  })
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

/**
 * Main entry point: Generate schedules with support for course linking
 */
export function generateSchedulesWithLinks (input: { courses: GenerateScheduleInfo; links: CourseLink[] }): AllCourses[] {
  const { courses, links } = input

  if (links.length === 0) {
    // No links - use original algorithm directly
    return generateAllSchedules(courses)
  }

  // Pre-process: merge linked courses
  const { courses: processedCourses, lookup } = mergeLinkedCourses(courses, links)

  // Run algorithm on processed courses
  const rawResults = generateAllSchedules(processedCourses)

  // Post-process: expand merged results
  return expandMergedResults(rawResults, lookup)
}
