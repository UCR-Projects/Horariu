import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CourseLink, ConnectionSet } from '@/types'

interface CourseLinkState {
  links: CourseLink[]

  // Create a new link between courses with connection sets
  createLinkWithConnections: (courses: string[], connectionSets: ConnectionSet[]) => string

  // Delete a link
  deleteLink: (linkId: string) => void

  // Update connection sets for a link
  updateLinkConnections: (linkId: string, connectionSets: ConnectionSet[]) => void

  // Get link for a course
  getLinkForCourse: (courseName: string) => CourseLink | undefined

  // Sync: update course name across all links
  updateCourseName: (oldName: string, newName: string) => void

  // Sync: update group name across all links
  updateGroupName: (courseName: string, oldGroupName: string, newGroupName: string) => void

  // Sync: remove a course from all links (when course is deleted)
  removeCourseFromLinks: (courseName: string) => void

  // Sync: remove connections that include a specific group (when schedule conflicts)
  removeConnectionsWithGroup: (courseName: string, groupName: string) => void

  // Clear all links
  clearAllLinks: () => void
}

const generateId = () => Math.random().toString(36).substring(2, 9)

const useCourseLinkStore = create<CourseLinkState>()(
  persist(
    (set, get) => ({
      links: [],

      createLinkWithConnections: (courses, connectionSets) => {
        const id = generateId()
        set((state) => ({
          links: [...state.links, { id, courses, connectionSets }],
        }))
        return id
      },

      deleteLink: (linkId) =>
        set((state) => ({
          links: state.links.filter((link) => link.id !== linkId),
        })),

      updateLinkConnections: (linkId, connectionSets) =>
        set((state) => ({
          links: state.links.map((link) =>
            link.id === linkId
              ? { ...link, connectionSets }
              : link
          ),
        })),

      getLinkForCourse: (courseName) => {
        return get().links.find((link) => link.courses.includes(courseName))
      },

      updateCourseName: (oldName, newName) =>
        set((state) => ({
          links: state.links.map((link) => {
            if (!link.courses.includes(oldName)) return link
            return {
              ...link,
              courses: link.courses.map((c) => (c === oldName ? newName : c)),
              connectionSets: link.connectionSets.map((cs) => ({
                groups: cs.groups.map((g) =>
                  g.course === oldName ? { ...g, course: newName } : g
                ),
              })),
            }
          }),
        })),

      updateGroupName: (courseName, oldGroupName, newGroupName) =>
        set((state) => ({
          links: state.links.map((link) => {
            if (!link.courses.includes(courseName)) return link
            return {
              ...link,
              connectionSets: link.connectionSets.map((cs) => ({
                groups: cs.groups.map((g) =>
                  g.course === courseName && g.group === oldGroupName
                    ? { ...g, group: newGroupName }
                    : g
                ),
              })),
            }
          }),
        })),

      removeCourseFromLinks: (courseName) =>
        set((state) => ({
          links: state.links
            .map((link) => {
              if (!link.courses.includes(courseName)) return link
              // Remove course from list and filter connection sets
              const newCourses = link.courses.filter((c) => c !== courseName)
              // If less than 2 courses remain, link is invalid
              if (newCourses.length < 2) return null
              // Remove connections that include this course
              const filteredSets = link.connectionSets.map((cs) => ({
                groups: cs.groups.filter((g) => g.course !== courseName),
              }))
              return { ...link, courses: newCourses, connectionSets: filteredSets }
            })
            .filter((link): link is CourseLink => link !== null && link.connectionSets.length > 0),
        })),

      removeConnectionsWithGroup: (courseName, groupName) =>
        set((state) => ({
          links: state.links
            .map((link) => {
              if (!link.courses.includes(courseName)) return link
              // Filter out connection sets that include this group
              const filteredSets = link.connectionSets.filter(
                (cs) => !cs.groups.some((g) => g.course === courseName && g.group === groupName)
              )
              return { ...link, connectionSets: filteredSets }
            })
            // Remove links that have no connection sets left
            .filter((link) => link.connectionSets.length > 0),
        })),

      clearAllLinks: () => set({ links: [] }),
    }),
    {
      name: 'course-link-storage',
      storage: createJSONStorage(() => localStorage),
      version: 3,
      migrate: () => {
        // Fresh start for new version - clear any old data
        return { links: [] }
      },
    }
  )
)

export default useCourseLinkStore

