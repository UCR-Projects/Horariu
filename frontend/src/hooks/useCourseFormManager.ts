import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { createCourseSchema, CourseFormValuesType } from '@/validation/schemas/course.schema'
import { Course, Group, Schedule } from '@/types'
import useCourseStore from '@/stores/useCourseStore'
import useScheduleStore from '@/stores/useScheduleStore'
import useCourseLinkStore from '@/stores/useCourseLinkStore'
import { DEFAULT_COLOR } from '@/utils/constants'
import { useI18n } from '@/hooks/useI18n'
import { groupsHaveConflict } from '@/utils/scheduleConflicts'

interface UseCourseFormManagerOptions {
  existingCourse?: Course
  isDialogOpen: boolean
  onSuccess: () => void
}

interface UseCourseFormManagerReturn {
  courseForm: ReturnType<typeof useForm<CourseFormValuesType>>
  currentGroups: CourseFormValuesType['groups']
  currentGroupNames: string[]
  isEditingCourse: boolean
  onSubmitCourse: (values: CourseFormValuesType) => void
}

/**
 * Hook for managing the course form state and submission.
 * Handles form initialization, reset on dialog open, and course creation/update.
 */
export function useCourseFormManager({
  existingCourse,
  isDialogOpen,
  onSuccess,
}: UseCourseFormManagerOptions): UseCourseFormManagerReturn {
  const { t } = useI18n('courses')
  const addCourse = useCourseStore((state) => state.addCourse)
  const updateCourse = useCourseStore((state) => state.updateCourse)
  const courses = useCourseStore((state) => state.courses)
  const updateCourseName = useScheduleStore((state) => state.updateCourseName)
  const updateGroupName = useScheduleStore((state) => state.updateGroupName)

  // Link store sync functions
  const updateLinkCourseName = useCourseLinkStore((state) => state.updateCourseName)
  const updateLinkGroupName = useCourseLinkStore((state) => state.updateGroupName)
  const links = useCourseLinkStore((state) => state.links)
  const updateLinkConnections = useCourseLinkStore((state) => state.updateLinkConnections)

  const isEditingCourse = !!existingCourse
  const existingCourseNames = courses.map((c) => c.name)

  // Initialize course form
  const courseForm = useForm<CourseFormValuesType>({
    resolver: zodResolver(createCourseSchema(existingCourseNames, existingCourse?.name)),
    defaultValues: {
      courseName: existingCourse?.name || '',
      color: existingCourse?.color || DEFAULT_COLOR,
      groups:
        existingCourse?.groups.map((group) => ({
          name: group.name,
          isActive: group.isActive ?? true,
          schedule: group.schedule,
        })) || [],
    },
  })

  // Refresh the form when dialog opens
  useEffect(() => {
    if (isDialogOpen && existingCourse) {
      courseForm.reset({
        courseName: existingCourse.name || '',
        color: existingCourse.color || DEFAULT_COLOR,
        groups:
          existingCourse.groups.map((group) => ({
            name: group.name,
            isActive: group.isActive ?? true,
            schedule: group.schedule,
          })) || [],
      })
    }
  }, [isDialogOpen, existingCourse, courseForm])

  // Get the current groups from the form
  const currentGroups = useWatch({
    control: courseForm.control,
    name: 'groups',
  })

  const currentGroupNames = currentGroups.map((g) => g.name)

  const onSubmitCourse = (values: CourseFormValuesType) => {
    const formattedGroups: Group[] = values.groups.map((group) => ({
      name: group.name,
      schedule: group.schedule as Schedule,
      isActive: group.isActive,
    }))

    if (!isEditingCourse) {
      addCourse({
        name: values.courseName,
        color: values.color,
        groups: formattedGroups,
        isActive: true,
      })
      toast.success(t('courseAdded'))
    } else {
      // If course name changed, sync to schedule store and link store
      if (existingCourse.name !== values.courseName) {
        updateCourseName(existingCourse.name, values.courseName)
        updateLinkCourseName(existingCourse.name, values.courseName)
      }

      // Sync group name changes to schedule store and link store
      // Use the NEW course name (after potential rename) for the lookup
      const currentCourseName = values.courseName
      existingCourse.groups.forEach((oldGroup, index) => {
        // Groups maintain order, so we compare by index
        if (index < formattedGroups.length) {
          const newGroupName = formattedGroups[index].name
          if (oldGroup.name !== newGroupName) {
            updateGroupName(currentCourseName, oldGroup.name, newGroupName)
            updateLinkGroupName(currentCourseName, oldGroup.name, newGroupName)
          }
        }
      })

      // Check if any linked connections now have schedule conflicts
      const link = links.find((l) => l.courses.includes(currentCourseName))
      if (link) {
        let hasConflictingConnections = false
        const validConnectionSets = link.connectionSets.filter((cs) => {
          // Get the group from this course in this connection set
          const thisGroup = cs.groups.find((g) => g.course === currentCourseName)
          if (!thisGroup) return true

          // Find the updated group data
          const updatedGroup = formattedGroups.find((g) => g.name === thisGroup.group)
          if (!updatedGroup) return true

          // Check against other groups in the connection set
          for (const otherGroupRef of cs.groups) {
            if (otherGroupRef.course === currentCourseName) continue

            // Find the other course and group
            const otherCourse = courses.find((c) => c.name === otherGroupRef.course)
            if (!otherCourse) continue

            const otherGroup = otherCourse.groups.find((g) => g.name === otherGroupRef.group)
            if (!otherGroup) continue

            // Check for conflict
            if (groupsHaveConflict(updatedGroup, otherGroup)) {
              hasConflictingConnections = true
              return false // Remove this connection set
            }
          }
          return true
        })

        // Update link if any connections were removed
        if (hasConflictingConnections) {
          updateLinkConnections(link.id, validConnectionSets)
          toast.info(t('linking.conflictingConnectionsRemoved'))
        }
      }

      updateCourse(existingCourse.name, {
        name: values.courseName,
        color: values.color,
        groups: formattedGroups,
        isActive: existingCourse.isActive,
      })
      toast.success(t('courseUpdated'))
    }

    courseForm.reset()
    onSuccess()
  }

  return {
    courseForm,
    currentGroups,
    currentGroupNames,
    isEditingCourse,
    onSubmitCourse,
  }
}
