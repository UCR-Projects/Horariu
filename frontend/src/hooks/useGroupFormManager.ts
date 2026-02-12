import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect, useCallback } from 'react'
import { createGroupSchema, GroupFormValuesType, CourseFormValuesType } from '@/validation/schemas/course.schema'
import { Day } from '@/types'
import { createEmptyFormSchedule } from '@/utils/scheduleConverters'
import { UseFormReturn } from 'react-hook-form'

interface UseGroupFormManagerOptions {
  courseForm: UseFormReturn<CourseFormValuesType>
  currentGroups: CourseFormValuesType['groups']
  currentGroupNames: string[]
  activeStep: 'course' | 'group'
  onStepChange: (step: 'course' | 'group') => void
}

interface UseGroupFormManagerReturn {
  groupForm: ReturnType<typeof useForm<GroupFormValuesType>>
  editingGroupIndex: number | null
  onSubmitGroup: (values: GroupFormValuesType) => void
  handleEditGroup: (index: number) => void
  handleDeleteGroup: (index: number) => void
  handleToggleGroupVisibility: (index: number) => void
  handleCancelGroupEdit: () => void
}

/**
 * Hook for managing the group form state and CRUD operations.
 * Handles group creation, editing, deletion, and visibility toggle.
 */
export function useGroupFormManager({
  courseForm,
  currentGroups,
  currentGroupNames,
  activeStep,
  onStepChange,
}: UseGroupFormManagerOptions): UseGroupFormManagerReturn {
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null)

  // Initialize group form
  const groupForm = useForm<GroupFormValuesType>({
    resolver: zodResolver(
      createGroupSchema(
        currentGroupNames,
        editingGroupIndex !== null ? currentGroups[editingGroupIndex]?.name : undefined
      )
    ),
    defaultValues: {
      groupName: '',
      schedules: createEmptyFormSchedule(),
    },
  })

  // Reset group form when changing steps (adding new group)
  useEffect(() => {
    if (activeStep === 'group' && editingGroupIndex === null) {
      groupForm.reset({
        groupName: '',
        schedules: createEmptyFormSchedule(),
      })
    }
  }, [activeStep, groupForm, editingGroupIndex])

  // Load group data when editing
  useEffect(() => {
    if (activeStep === 'group' && editingGroupIndex !== null) {
      const groupToEdit = currentGroups[editingGroupIndex]
      if (groupToEdit) {
        groupForm.reset({
          groupName: groupToEdit.name,
          schedules: groupToEdit.schedule.map((schedule) => ({
            day: schedule.day,
            active: schedule.active,
            timeBlocks: schedule.timeBlocks || [],
          })),
        })
      }
    }
  }, [editingGroupIndex, currentGroups, activeStep, groupForm])

  const onSubmitGroup = useCallback(
    (values: GroupFormValuesType) => {
      const newGroup = {
        name: values.groupName,
        schedule: values.schedules.map(
          (schedule: { day: Day; active: boolean; timeBlocks: { start: string; end: string }[] }) => ({
            day: schedule.day,
            active: schedule.active,
            timeBlocks: schedule.active ? schedule.timeBlocks : [],
          })
        ),
        isActive: true,
      }

      const groups = courseForm.getValues('groups') || []

      if (editingGroupIndex !== null) {
        // Editing existing group
        const updatedGroups = [...groups]
        updatedGroups[editingGroupIndex] = newGroup
        courseForm.reset({ ...courseForm.getValues(), groups: updatedGroups })
        setEditingGroupIndex(null)
      } else {
        // Adding new group
        courseForm.setValue('groups', [...groups, newGroup], { shouldValidate: true })
        groupForm.reset()
      }

      onStepChange('course')
    },
    [courseForm, editingGroupIndex, groupForm, onStepChange]
  )

  const handleEditGroup = useCallback(
    (index: number) => {
      setEditingGroupIndex(index)
      onStepChange('group')
    },
    [onStepChange]
  )

  const handleDeleteGroup = useCallback(
    (index: number) => {
      const groups = courseForm.getValues('groups')
      const updatedGroups = groups.filter((_, i) => i !== index)
      courseForm.setValue('groups', updatedGroups as CourseFormValuesType['groups'], {
        shouldValidate: true,
      })
    },
    [courseForm]
  )

  const handleToggleGroupVisibility = useCallback(
    (index: number) => {
      const groups = courseForm.getValues('groups')
      const updatedGroups = groups.map((group, i) => (i === index ? { ...group, isActive: !group.isActive } : group))
      courseForm.setValue('groups', updatedGroups as CourseFormValuesType['groups'], {
        shouldValidate: true,
      })
    },
    [courseForm]
  )

  const handleCancelGroupEdit = useCallback(() => {
    onStepChange('course')
    setEditingGroupIndex(null)
  }, [onStepChange])

  return {
    groupForm,
    editingGroupIndex,
    onSubmitGroup,
    handleEditGroup,
    handleDeleteGroup,
    handleToggleGroupVisibility,
    handleCancelGroupEdit,
  }
}

