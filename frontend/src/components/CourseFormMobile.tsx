import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { DAYS } from '@/utils/constants'
import TimeRangeSelector from '@/components/TimeRangeSelector'
import WeekDaySelector from '@/components/WeekDaySelector'
import {
  createCourseSchema,
  createGroupSchema,
  GroupFormValuesType,
  CourseFormValuesType,
} from '@/validation/schemas/course.schema'
import { Trash2, Edit2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import ColorPicker from './ColorPicker'
import { Day, Group, Schedule, Course } from '@/types'
import { useTranslation } from 'react-i18next'
import useCourseStore from '@/stores/useCourseStore'
import { DEFAULT_COLOR } from '@/utils/constants'

interface CourseFormDrawerProps {
  existingCourse?: Course
}

export default function CourseFormDrawer({
  existingCourse,
}: CourseFormDrawerProps) {
  const isEditingCourse = !!existingCourse
  const { t } = useTranslation()
  const { addCourse, updateCourse } = useCourseStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeStep, setActiveStep] = useState<'course' | 'group'>('course')

  // State for editing group, (have the index of the group being edited)
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(
    null
  )

  // Init course form
  const courseForm = useForm<CourseFormValuesType>({
    resolver: zodResolver(createCourseSchema(existingCourse?.name)),
    defaultValues: {
      courseName: existingCourse?.name || '',
      color: existingCourse?.color || DEFAULT_COLOR,
      groups:
        existingCourse?.groups.map((group) => ({
          name: group.name,
          schedule: DAYS.map((day) => {
            const daySchedule = group.schedule[day]
            return {
              day,
              active: !!daySchedule,
              startTime: daySchedule?.start || '----',
              endTime: daySchedule?.end || '----',
            }
          }),
        })) || [],
    },
  })

  // Refresh the form when dialog opens
  useEffect(() => {
    if (isDrawerOpen && existingCourse) {
      courseForm.reset({
        courseName: existingCourse.name || '',
        color: existingCourse.color || DEFAULT_COLOR,
        groups:
          existingCourse.groups.map((group) => ({
            name: group.name,
            schedule: DAYS.map((day) => {
              const daySchedule = group.schedule[day]
              return {
                day,
                active: !!daySchedule,
                startTime: daySchedule?.start || '----',
                endTime: daySchedule?.end || '----',
              }
            }),
          })) || [],
      })
    }
  }, [isDrawerOpen, existingCourse, courseForm])

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
        editingGroupIndex !== null
          ? currentGroups[editingGroupIndex]?.name
          : undefined
      )
    ),
    defaultValues: {
      groupName: '',
      schedules: DAYS.map((day) => ({
        day,
        active: false,
        startTime: '----',
        endTime: '----',
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
          startTime: '----',
          endTime: '----',
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
            startTime: schedule.active ? schedule.startTime : '----',
            endTime: schedule.active ? schedule.endTime : '----',
          })),
        })
      }
    }
  }, [editingGroupIndex, currentGroups, activeStep, groupForm])

  const handleDayToggle = (day: Day, active: boolean) => {
    const currentSchedules = groupForm.getValues('schedules')
    const updatedSchedules = currentSchedules.map((schedule) =>
      // if the day is the one being toggled, update to the new active state
      schedule.day === day
        ? { ...schedule, active, startTime: '----', endTime: '----' }
        : schedule
    )
    groupForm.setValue('schedules', updatedSchedules, { shouldValidate: true })
  }

  const handleTimeChange = (day: Day, startTime: string, endTime: string) => {
    const currentSchedules = groupForm.getValues('schedules')
    const updatedSchedules = currentSchedules.map((schedule) =>
      // if the day is the one being updated, update the time range otherwise keep the same
      schedule.day === day ? { ...schedule, startTime, endTime } : schedule
    )
    groupForm.setValue('schedules', updatedSchedules, { shouldValidate: true })
  }

  const onSubmitGroup = (values: GroupFormValuesType) => {
    const newGroup = {
      name: values.groupName,
      schedule: values.schedules.map((schedule) => ({
        day: schedule.day,
        active: schedule.active,
        startTime: schedule.active ? schedule.startTime : '----',
        endTime: schedule.active ? schedule.endTime : '----',
      })),
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

  const handleEditGroup = (index: number) => {
    setEditingGroupIndex(index)
    setActiveStep('group')
  }

  const handleDeleteGroup = (index: number) => {
    const currentGroups = courseForm.getValues('groups')
    const updatedGroups = currentGroups.filter((_, i) => i !== index)
    courseForm.setValue(
      'groups',
      updatedGroups as CourseFormValuesType['groups'],
      { shouldValidate: true }
    )
  }

  const onSubmitCourse = (values: CourseFormValuesType) => {
    const formattedGroups: Group[] = values.groups.map((group) => ({
      name: group.name,
      schedule: group.schedule
        .filter((s) => s.active)
        .reduce((acc, curr) => {
          acc[curr.day] = {
            start: curr.startTime,
            end: curr.endTime,
          }
          return acc
        }, {} as Schedule),
    }))

    if (!isEditingCourse) {
      addCourse({
        name: values.courseName,
        color: values.color,
        groups: formattedGroups,
      })
    } else {
      updateCourse(existingCourse.name, {
        name: values.courseName,
        color: values.color,
        groups: formattedGroups,
      })
    }

    courseForm.reset()
    setIsDrawerOpen(false)
  }

  // Get the active days from the group form
  const activeDays = groupForm.watch('schedules')?.filter((s) => s.active) || []

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        {isEditingCourse ? (
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7 dark:hover:bg-neutral-900/80 cursor-pointer'
          >
            <Edit2 className='h-4 w-4 text-neutral-600' />
          </Button>
        ) : (
          <Button className='cursor-pointer'>{t('addCourse')}</Button>
        )}
      </DrawerTrigger>

      <DrawerContent className='sm:max-w-[425px]'>
        {activeStep === 'course' && (
          <>
            <DrawerHeader>
              <DrawerTitle className='text-lg'>
                {isEditingCourse ? t('editCourse') : t('newCourse')}
              </DrawerTitle>
              <DrawerDescription className='text-sm'>
                {isEditingCourse ? t('editCourseDes') : t('courseFormDes')}
              </DrawerDescription>
            </DrawerHeader>

            <Form {...courseForm}>
              <form
                onSubmit={courseForm.handleSubmit(onSubmitCourse)}
                className='space-y-4 overflow-y-auto max-h-[70vh]'
              >
                <FormField
                  control={courseForm.control}
                  name='courseName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm'>
                        {t('courseName')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('courseName')}
                          {...field}
                          className='text-sm py-2'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={courseForm.control}
                  name='color'
                  render={({ field }) => (
                    <FormItem>
                      <ColorPicker
                        colorValue={field.value}
                        onColorChange={(color) => field.onChange(color)}
                      />
                    </FormItem>
                  )}
                />

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <FormLabel className='text-sm'>{t('group')}s</FormLabel>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='text-xs px-2 py-1 cursor-pointer'
                      onClick={() => setActiveStep('group')}
                    >
                      {t('addGroup')}
                    </Button>
                  </div>

                  {courseForm.formState.errors.groups?.message && (
                    <div className='text-red-500 text-sm'>
                      {courseForm.formState.errors.groups?.message}
                    </div>
                  )}

                  {currentGroups.length > 0 ? (
                    <Accordion
                      type='single'
                      collapsible
                      className='border rounded-md'
                    >
                      {currentGroups.map((group, index) => {
                        const isLast = index === currentGroups.length - 1
                        return (
                          <AccordionItem
                            key={index}
                            value={`group-${index}`}
                            className='border-b last:border-b-0'
                          >
                            <AccordionTrigger className='px-3 py-2 transition-colors group cursor-pointer'>
                              <div className='flex items-center justify-between w-full'>
                                <span className='text-sm font-medium text-sky-600'>
                                  {group.name}
                                </span>
                                <div className='flex items-center space-x-2'>
                                  <span
                                    className='inline-flex items-center justify-center h-7 w-7 rounded-md dark:hover:bg-neutral-800'
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditGroup(index)
                                    }}
                                  >
                                    <Edit2 className='h-4 w-4 text-neutral-600' />
                                  </span>
                                  <span
                                    className='inline-flex items-center justify-center h-7 w-7 rounded-md dark:hover:bg-neutral-800'
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteGroup(index)
                                    }}
                                  >
                                    <Trash2 className='h-4 w-4 text-neutral-600' />
                                  </span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent
                              className={`px-4 py-2 bg-neutral-50 dark:bg-neutral-900 text-sm ${isLast ? 'rounded-b-sm' : ''}`}
                            >
                              <div className='space-y-1'>
                                {group.schedule
                                  .filter((s) => s.active)
                                  .map((schedule) => (
                                    <div
                                      key={schedule.day}
                                      className='flex justify-between text-neutral-500 py-1 border-b last:border-b-0 '
                                    >
                                      <span className='font-medium'>
                                        {t(`days.${schedule.day}.short`)}
                                      </span>
                                      <span>
                                        {schedule.startTime} -{' '}
                                        {schedule.endTime}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </Accordion>
                  ) : (
                    <div className='border rounded-md p-3 text-center text-xs text-neutral-500 italic'>
                      {t('noGroupsYet')}
                    </div>
                  )}
                </div>

                <DrawerFooter className='pt-2'>
                  <div className='flex justify-between space-x-3'>
                    {isEditingCourse && (
                      <Button
                        type='button'
                        variant='outline'
                        className='cursor-pointer'
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        {t('cancel')}
                      </Button>
                    )}
                    <Button type='submit' className='cursor-pointer'>
                      {isEditingCourse ? t('save') : t('addCourse')}
                    </Button>
                  </div>
                </DrawerFooter>
              </form>
            </Form>
          </>
        )}

        {activeStep === 'group' && (
          <>
            <DrawerHeader>
              <DrawerTitle className='text-lg'>
                {editingGroupIndex !== null ? t('editGroup') : t('newGroup')}
              </DrawerTitle>
              <DrawerDescription className='text-sm'>
                {editingGroupIndex !== null
                  ? t('editGroupFormDes')
                  : t('groupFormDes')}
              </DrawerDescription>
            </DrawerHeader>

            <Form {...groupForm}>
              <form
                onSubmit={groupForm.handleSubmit(onSubmitGroup)}
                className='space-y-4 overflow-y-auto max-h-[70vh]'
              >
                <FormField
                  control={groupForm.control}
                  name='groupName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm'>
                        {t('groupName')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('groupName')}
                          {...field}
                          className='text-sm py-2'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='space-y-2'>
                  <FormLabel className='text-sm'>{t('schedule')}</FormLabel>

                  {groupForm.formState.errors.schedules?.message && (
                    <div className='text-red-500 text-sm'>
                      {groupForm.formState.errors.schedules?.message}
                    </div>
                  )}

                  <div className='space-y-1 pt-2'>
                    {/* Days Selector */}
                    <div className='flex justify-between w-full py-2'>
                      {DAYS.map((day) => {
                        const schedule = groupForm
                          .watch('schedules')
                          .find((s) => s.day === day)
                        const isActive = schedule?.active || false

                        return (
                          <WeekDaySelector
                            key={day}
                            day={day}
                            active={isActive}
                            onToggle={(active) => handleDayToggle(day, active)}
                          />
                        )
                      })}
                    </div>

                    {/* Schedule Selectors */}
                    {activeDays.length > 0 ? (
                      <div className='border-t pt-2 mt-2'>
                        <div className='p-2 rounded'>
                          <div className='flex items-center mb-2'>
                            <div className='w-24'></div>
                            <div className='w-24 text-xs text-neutral-500 font-medium text-center italic'>
                              {t('from')}:
                            </div>
                            <div className='w-24 text-xs text-neutral-500 font-medium text-center italic'>
                              {t('to')}:
                            </div>
                          </div>
                          {activeDays.map((schedule) => (
                            <TimeRangeSelector
                              key={schedule.day}
                              day={schedule.day}
                              startTime={schedule.startTime}
                              endTime={schedule.endTime}
                              onChange={handleTimeChange}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className='text-xs text-neutral-500 italic text-center border-t pt-3'>
                        {t('noActiveDays')}
                      </div>
                    )}
                  </div>
                </div>

                <DrawerFooter className='pt-2'>
                  <div className='flex justify-between space-x-3'>
                    <Button
                      type='button'
                      variant='outline'
                      className='cursor-pointer'
                      onClick={() => {
                        setActiveStep('course')
                        setEditingGroupIndex(null)
                      }}
                    >
                      {t('cancel')}
                    </Button>
                    <Button className='cursor-pointer' type='submit'>
                      {t('save')}
                    </Button>
                  </div>
                </DrawerFooter>
              </form>
            </Form>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
