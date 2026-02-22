import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { createCourseSchema, CourseFormValuesType } from '@/validation/schemas/course.schema'
import { Course, Group, Schedule } from '@/types'
import useCourseStore from '@/stores/useCourseStore'
import useScheduleStore from '@/stores/useScheduleStore'
import { DEFAULT_COLOR } from '@/utils/constants'

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
  const addCourse = useCourseStore((state) => state.addCourse)
  const updateCourse = useCourseStore((state) => state.updateCourse)
  const courses = useCourseStore((state) => state.courses)
  const updateCourseName = useScheduleStore((state) => state.updateCourseName)
  const updateGroupName = useScheduleStore((state) => state.updateGroupName)

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
    } else {
      // If course name changed, sync to schedule store so tables update instantly
      if (existingCourse.name !== values.courseName) {
        updateCourseName(existingCourse.name, values.courseName)
      }

      // Sync group name changes to schedule store
      // Use the NEW course name (after potential rename) for the lookup
      const currentCourseName = values.courseName
      existingCourse.groups.forEach((oldGroup, index) => {
        // Groups maintain order, so we compare by index
        if (index < formattedGroups.length) {
          const newGroupName = formattedGroups[index].name
          if (oldGroup.name !== newGroupName) {
            updateGroupName(currentCourseName, oldGroup.name, newGroupName)
          }
        }
      })

      updateCourse(existingCourse.name, {
        name: values.courseName,
        color: values.color,
        groups: formattedGroups,
        isActive: existingCourse.isActive,
      })
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
