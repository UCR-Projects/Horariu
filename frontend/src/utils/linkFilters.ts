import { Course, CourseLink, ConnectionSet } from '@/types'

export interface FilterLinksResult {
  filteredLinks: CourseLink[]
  ignoredLinks: string[] // Names of links that were ignored (for warning)
}

/**
 * Filter links to only include active courses and groups.
 * This ensures generation doesn't fail due to hidden or deleted items.
 * Returns both filtered links and names of ignored links for user notification.
 */
export function filterLinksForGeneration(
  links: CourseLink[],
  courses: Course[]
): FilterLinksResult {
  // Build a set of active course names
  const activeCourseNames = new Set(
    courses.filter((c) => c.isActive).map((c) => c.name)
  )

  // Build a map of active group names per course
  const activeGroupsMap: Record<string, Set<string>> = {}
  for (const course of courses) {
    if (course.isActive) {
      activeGroupsMap[course.name] = new Set(
        course.groups.filter((g) => g.isActive).map((g) => g.name)
      )
    }
  }

  const ignoredLinks: string[] = []

  const filteredLinks = links
    .map((link) => {
      // Filter courses in link to only active ones
      const activeLinkCourses = link.courses.filter((c) => activeCourseNames.has(c))

      // If less than 2 active courses, skip this link entirely
      if (activeLinkCourses.length < 2) {
        ignoredLinks.push(link.courses.join(' ↔ '))
        return null
      }

      // Filter connection sets to only include active groups
      const validConnectionSets: ConnectionSet[] = link.connectionSets
        .map((cs) => {
          const validGroups = cs.groups.filter((g) => {
            // Course must be active
            if (!activeCourseNames.has(g.course)) return false
            // Group must be active
            const courseGroups = activeGroupsMap[g.course]
            return courseGroups?.has(g.group) ?? false
          })

          // Connection set must have all courses represented
          const representedCourses = new Set(validGroups.map((g) => g.course))
          if (representedCourses.size < activeLinkCourses.length) {
            return null
          }

          return { groups: validGroups }
        })
        .filter((cs): cs is ConnectionSet => cs !== null)

      // If no valid connection sets, skip this link
      if (validConnectionSets.length === 0) {
        ignoredLinks.push(link.courses.join(' ↔ '))
        return null
      }

      return {
        ...link,
        courses: activeLinkCourses,
        connectionSets: validConnectionSets,
      }
    })
    .filter((link): link is CourseLink => link !== null)

  return { filteredLinks, ignoredLinks }
}

