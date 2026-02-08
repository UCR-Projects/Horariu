import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { DAYS } from '@/utils/constants'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  createCourseSchema,
  createGroupSchema,
  GroupFormValuesType,
  CourseFormValuesType,
} from '@/validation/schemas/course.schema'
import { Edit2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'

import { Group, Schedule, Course, Day } from '@/types'
import { useI18n } from '@/hooks/useI18n'
import useCourseStore from '@/stores/useCourseStore'
import { DEFAULT_COLOR } from '@/utils/constants'
import { GroupInputsForm } from '@/components/courseForm/GroupInputsForm'
import { CourseInputsForm } from '@/components/courseForm/CourseInputsForm'

interface CourseFormProps {
  existingCourse?: Course
}

export default function CourseForm({ existingCourse }: CourseFormProps) {
  const isMobile = useIsMobile()
  const isEditingCourse = !!existingCourse
  const { t } = useI18n('courses')
  const { addCourse, updateCourse } = useCourseStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeStep, setActiveStep] = useState<'course' | 'group'>('course')

  // State for editing group, (have the index of the group being edited)
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null)

  // Helper function to convert schedule to form format
  const convertScheduleToFormFormat = (schedule: Schedule) => {
    return DAYS.map((day) => {
      const daySchedule = schedule[day]
      return {
        day,
        active: !!daySchedule && daySchedule.length > 0,
        timeBlocks: daySchedule || [],
      }
    })
  }

  // Helper function to convert form format to schedule
  const convertFormFormatToSchedule = (
    schedules: CourseFormValuesType['groups'][0]['schedule']
  ) => {
    return schedules
      .filter((s) => s.active && s.timeBlocks.length > 0)
      .reduce((acc, curr) => {
        acc[curr.day] = curr.timeBlocks
        return acc
      }, {} as Schedule)
  }

  // Init course form
  const courseForm = useForm<CourseFormValuesType>({
    resolver: zodResolver(createCourseSchema(existingCourse?.name)),
    defaultValues: {
      courseName: existingCourse?.name || '',
      color: existingCourse?.color || DEFAULT_COLOR,
      groups:
        existingCourse?.groups.map((group) => ({
          name: group.name,
          isActive: group.isActive ?? true,
          schedule: convertScheduleToFormFormat(group.schedule),
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
            schedule: convertScheduleToFormFormat(group.schedule),
          })) || [],
      })
    }
  }, [isDialogOpen, existingCourse, courseForm])

  // Get the current groups from the form
  const currentGroups = useWatch({
    control: courseForm.control,
    name: 'groups',
  })

  // Get the current group names
  const currentGroupNames = currentGroups.map((g) => g.name)

  // Init group form
  const groupForm = useForm<GroupFormValuesType>({
    resolver: zodResolver(
      createGroupSchema(
        currentGroupNames,
        editingGroupIndex !== null ? currentGroups[editingGroupIndex]?.name : undefined
      )
    ),
    defaultValues: {
      groupName: '',
      schedules: DAYS.map((day) => ({
        day,
        active: false,
        timeBlocks: [],
      })),
    },
  })

  // Reset group form when changing steps
  useEffect(() => {
    if (activeStep === 'group' && editingGroupIndex === null) {
      groupForm.reset({
        groupName: '',
        schedules: DAYS.map((day) => ({
          day,
          active: false,
          timeBlocks: [],
        })),
      })
    }
  }, [activeStep, groupForm, editingGroupIndex])

  // Load group data when editing
  useEffect(() => {
    if (activeStep === 'group' && editingGroupIndex !== null) {
      const groupToEdit = currentGroups[editingGroupIndex]
      if (groupToEdit) {
        // reset the form with the group data
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

  const onSubmitGroup = (values: GroupFormValuesType) => {
    const newGroup = {
      name: values.groupName,
      schedule: values.schedules.map(
        (schedule: {
          day: Day
          active: boolean
          timeBlocks: { start: string; end: string }[]
        }) => ({
          day: schedule.day,
          active: schedule.active,
          timeBlocks: schedule.active ? schedule.timeBlocks : [],
        })
      ),
      isActive: true,
    }

    const currentGroups = courseForm.getValues('groups') || []

    // if we are editing a group
    if (editingGroupIndex !== null) {
      const updatedGroups = [...currentGroups]
      updatedGroups[editingGroupIndex] = newGroup

      const updatedCourseValues = {
        ...courseForm.getValues(),
        groups: updatedGroups,
      }

      // Update the course form with the new group data
      courseForm.reset(updatedCourseValues)
      setEditingGroupIndex(null)
    } else {
      // Add the new group to the list
      courseForm.setValue('groups', [...currentGroups, newGroup], {
        shouldValidate: true,
      })
      groupForm.reset()
    }
    setActiveStep('course')
  }

  const handleToggleGroupVisibility = (index: number) => {
    const currentGroups = courseForm.getValues('groups')
    const updatedGroups = currentGroups.map((group, i) =>
      i === index ? { ...group, isActive: !group.isActive } : group
    )

    courseForm.setValue('groups', updatedGroups as CourseFormValuesType['groups'], {
      shouldValidate: true,
    })
  }

  const handleEditGroup = (index: number) => {
    setEditingGroupIndex(index)
    setActiveStep('group')
  }

  const handleDeleteGroup = (index: number) => {
    const currentGroups = courseForm.getValues('groups')
    const updatedGroups = currentGroups.filter((_, i) => i !== index)
    courseForm.setValue('groups', updatedGroups as CourseFormValuesType['groups'], {
      shouldValidate: true,
    })
  }

  const onSubmitCourse = (values: CourseFormValuesType) => {
    const formattedGroups: Group[] = values.groups.map((group) => ({
      name: group.name,
      schedule: convertFormFormatToSchedule(group.schedule),
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
      updateCourse(existingCourse.name, {
        name: values.courseName,
        color: values.color,
        groups: formattedGroups,
        isActive: existingCourse.isActive,
      })
    }

    courseForm.reset()
    setIsDialogOpen(false)
  }

  const content =
    activeStep === 'course' ? (
      <CourseInputsForm
        form={courseForm}
        isEditingCourse={isEditingCourse}
        groups={courseForm.watch('groups')}
        onSubmit={onSubmitCourse}
        onAddGroup={() => setActiveStep('group')}
        onEditGroup={handleEditGroup}
        onDeleteGroup={handleDeleteGroup}
        onToggleGroupVisibility={handleToggleGroupVisibility}
        onCancel={() => setIsDialogOpen(false)}
      />
    ) : (
      <GroupInputsForm
        form={groupForm}
        isEditing={editingGroupIndex !== null}
        onSubmit={onSubmitGroup}
        onCancel={() => {
          setActiveStep('course')
          setEditingGroupIndex(null)
        }}
      />
    )
  return (
    <>
      {isMobile ? (
        <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DrawerTrigger asChild>
            {isEditingCourse ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-green-200  dark:hover:bg-neutral-900/80 cursor-pointer"
              >
                <Edit2 className="h-4 w-4 text-neutral-600" />
              </Button>
            ) : (
              <Button className="cursor-pointer">{t('addCourse')}</Button>
            )}
          </DrawerTrigger>

          <DrawerContent>{content}</DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {isEditingCourse ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 dark:hover:bg-neutral-900/80  hover:bg-neutral-200 cursor-pointer"
              >
                <Edit2 className="h-4 w-4 text-neutral-600" />
              </Button>
            ) : (
              <Button className="cursor-pointer">{t('addCourse')}</Button>
            )}
          </DialogTrigger>

          <DialogContent className="sm:max-w-106.25">{content}</DialogContent>
        </Dialog>
      )}
    </>
  )
}
