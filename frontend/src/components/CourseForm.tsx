import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { courseSchema, groupSchema } from '@/validation/schemas/course.schema'
import TimeRangeSelector from './TimeRangeSelector'
import WeekDaySelector from './WeekDaySelector'
import { validMsgs } from '@/validation/validationMessages'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { DAYS } from '@/utils/constants'
import ColorPicker from './ColorPicker'
import { Day, Group, Schedule, Course } from '@/types'
import { useTranslation } from 'react-i18next'
import useCourseStore from '@/stores/useCourseStore'
import { DEFAULT_COLOR } from '@/utils/constants'

interface ScheduleGroupForm {
  day: Day
  active: boolean
  startTime: string
  endTime: string
}

interface CourseFormDialogProps {
  existingCourse?: Course
}

export default function CourseFormDialog({
  existingCourse,
}: CourseFormDialogProps) {
  const isEditingCourse = !!existingCourse
  const { t } = useTranslation()
  const { addCourse, updateCourse } = useCourseStore()
  const [selectedColor, setSelectedColor] = useState<string>(
    existingCourse?.color || DEFAULT_COLOR
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeStep, setActiveStep] = useState<'course' | 'group'>('course')
  const [groups, setGroups] = useState<
    { name: string; schedule: ScheduleGroupForm[] }[]
  >(
    existingCourse?.groups.map((group) => ({
      name: group.name,
      schedule: DAYS.filter((day) => group.schedule[day]).map((day) => ({
        day,
        active: true,
        startTime: group.schedule[day].start,
        endTime: group.schedule[day].end,
      })),
    })) || []
  )

  const [schedules, setSchedules] = useState<ScheduleGroupForm[]>(
    DAYS.map((day) => ({
      day: day,
      active: !!existingCourse?.groups.some((group) => group.schedule[day]),
      startTime:
        existingCourse?.groups.find((group) => group.schedule[day])?.schedule[
          day
        ]?.start || '----',
      endTime:
        existingCourse?.groups.find((group) => group.schedule[day])?.schedule[
          day
        ]?.end || '----',
    }))
  )

  useEffect(() => {
    if (existingCourse) {
      setSelectedColor(existingCourse.color || DEFAULT_COLOR)
      setGroups(
        existingCourse.groups.map((group) => ({
          name: group.name,
          schedule: DAYS.filter((day) => group.schedule[day]).map((day) => ({
            day,
            active: true,
            startTime: group.schedule[day].start,
            endTime: group.schedule[day].end,
          })),
        }))
      )

      setSchedules(
        DAYS.map((day) => ({
          day: day,
          active: !!existingCourse.groups.some((group) => group.schedule[day]),
          startTime:
            existingCourse.groups.find((group) => group.schedule[day])
              ?.schedule[day]?.start || '----',
          endTime:
            existingCourse.groups.find((group) => group.schedule[day])
              ?.schedule[day]?.end || '----',
        }))
      )
    }
  }, [existingCourse, isDialogOpen])

  const [editingGroup, setEditingGroup] = useState<{
    index: number
    group: { name: string; schedule: ScheduleGroupForm[] }
  } | null>(null)

  const courseForm = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseName: existingCourse?.name || '',
    },
  })

  const groupForm = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      groupName: '',
      schedule: schedules,
    },
  })

  const handleDayToggle = (day: Day, active: boolean) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.day === day
          ? { ...schedule, active, startTime: '----', endTime: '----' }
          : schedule
      )
    )
  }

  const handleTimeChange = (day: Day, startTime: string, endTime: string) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.day === day ? { ...schedule, startTime, endTime } : schedule
      )
    )
  }

  const handleAddGroup = (values: z.infer<typeof groupSchema>) => {
    const groupNameExists = groups.some(
      (group, i) => i !== editingGroup?.index && group.name === values.groupName
    )

    if (groupNameExists) {
      groupForm.setError('groupName', {
        message: validMsgs.group.name.unique,
      })
      return
    }

    const hasActiveDays = schedules.some((s) => s.active)
    if (!hasActiveDays) {
      groupForm.setError('schedule', {
        type: 'manual',
        message: validMsgs.group.schedule.required,
      })
      return
    }

    const hasInvalidTimes = schedules.some(
      (s) => s.active && (s.startTime === '----' || s.endTime === '----')
    )
    if (hasInvalidTimes) {
      groupForm.setError('schedule', {
        // Reset schedules

        type: 'manual',
        message: validMsgs.group.schedule.timeRange,
      })
      return
    }

    const newGroup = {
      name: values.groupName,
      schedule: schedules.filter((s) => s.active),
    }

    if (editingGroup !== null) {
      const updatedGroups = [...groups]
      updatedGroups[editingGroup.index] = newGroup
      setGroups(updatedGroups)
      setEditingGroup(null)
    } else {
      setGroups([...groups, newGroup])
    }

    groupForm.reset()

    setSchedules(
      DAYS.map((day) => ({
        day: day,
        active: false,
        startTime: '----',
        endTime: '----',
      }))
    )

    setActiveStep('course')
  }

  const handleEditGroup = (index: number) => {
    const groupToEdit = groups[index]

    const editSchedules = DAYS.map((day) => {
      const scheduleForDay = groupToEdit.schedule.find((s) => s.day === day)
      return scheduleForDay
        ? { ...scheduleForDay, active: true }
        : { day, active: false, startTime: '----', endTime: '----' }
    })

    setSchedules(editSchedules)
    groupForm.setValue('groupName', groupToEdit.name)

    setEditingGroup({ index, group: groupToEdit })
    setActiveStep('group')
  }

  const handleDeleteGroup = (index: number) => {
    const updatedGroups = groups.filter((_, i) => i !== index)
    setGroups(updatedGroups)
  }

  function onSubmitCourse(values: z.infer<typeof courseSchema>) {
    if (groups.length === 0) {
      return
    }

    const formattedGroups: Group[] = groups.map((group) => ({
      name: group.name,
      schedule: group.schedule.reduce((acc, curr) => {
        if (curr.active) {
          acc[curr.day] = {
            start: curr.startTime,
            end: curr.endTime,
          }
        }
        return acc
      }, {} as Schedule),
    }))

    if (!isEditingCourse) {
      addCourse({
        name: values.courseName,
        color: selectedColor,
        groups: formattedGroups,
      })
    } else {
      updateCourse(existingCourse.name, {
        name: values.courseName,
        color: selectedColor,
        groups: formattedGroups,
      })
    }

    courseForm.reset()
    setGroups([])
    setIsDialogOpen(false)
    setSelectedColor(DEFAULT_COLOR)
  }

  const activeDays = schedules.filter((s) => s.active)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {isEditingCourse ? (
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7 dark:hover:bg-neutral-900/80'
          >
            <Edit2 className='h-4 w-4 text-neutral-600' />
          </Button>
        ) : (
          <Button>{t('addCourse')}</Button>
        )}
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        {activeStep === 'course' && (
          <>
            <DialogHeader>
              <DialogTitle className='text-lg'>
                {isEditingCourse ? t('editCourse') : t('newCourse')}
              </DialogTitle>
              <DialogDescription className='text-sm'>
                {t('courseFormDescription')}
              </DialogDescription>
            </DialogHeader>

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
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />

                <ColorPicker
                  colorValue={selectedColor}
                  onColorChange={(newValue) => setSelectedColor(newValue)}
                />

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <FormLabel className='text-sm'>{t('groups')}</FormLabel>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='text-xs px-2 py-1'
                      onClick={() => setActiveStep('group')}
                    >
                      {t('addGroup')}
                    </Button>
                  </div>

                  {groups.length > 0 ? (
                    <Accordion
                      type='single'
                      collapsible
                      className='border rounded-md'
                    >
                      {groups.map((group, index) => (
                        <AccordionItem
                          key={index}
                          value={`group-${index}`}
                          className='border-b last:border-b-0'
                        >
                          <AccordionTrigger className='px-3 py-2 transition-colors group'>
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
                          <AccordionContent className='px-3 py-2 text-sm'>
                            {group.schedule.map((s, i) => (
                              <div
                                key={i}
                                className='flex justify-between text-neutral-600 py-1 border-b last:border-b-0'
                              >
                                <span>{s.day}</span>
                                <span>
                                  {s.startTime} - {s.endTime}
                                </span>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className='text-xs text-neutral-500 italic'>
                      {t('noGroupsYet')}
                    </div>
                  )}
                </div>

                <DialogFooter className='pt-4'>
                  <Button
                    type='submit'
                    className='w-full text-sm py-2'
                    disabled={groups.length === 0}
                  >
                    {t('addCourse')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {activeStep === 'group' && (
          <>
            <DialogHeader>
              <DialogTitle className='text-lg'>
                {editingGroup ? t('editGroup') : t('newGroup')}
              </DialogTitle>
              <DialogDescription className='text-sm'>
                {t('groupFormDescription')}
              </DialogDescription>
            </DialogHeader>

            <Form {...groupForm}>
              <form
                onSubmit={groupForm.handleSubmit(handleAddGroup)}
                className='space-y-4 overflow-y-auto max-h-[65vh]'
              >
                <FormField
                  control={groupForm.control}
                  name='groupName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('groupName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('groupName')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='space-y-2'>
                  <FormLabel
                    className={`${groupForm.formState.errors.schedule ? 'text-red-500' : 'text-foreground'}`}
                  >
                    {t('schedule')}
                  </FormLabel>

                  <WeekDaySelector
                    schedules={schedules}
                    onToggleDay={handleDayToggle}
                  />

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
                            disabled={!schedule.active}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className='text-xs text-neutral-500 italic text-center border-t pt-3'>
                      {t('noActiveDays')}
                    </div>
                  )}

                  {groupForm.formState.errors.schedule && (
                    <div className='text-red-500 text-sm'>
                      {groupForm.formState.errors.schedule.message}
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <div className='space-x-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='lg'
                      onClick={() => {
                        setActiveStep('course')
                        setEditingGroup(null)
                        groupForm.reset()
                        setSchedules(
                          DAYS.map((day) => ({
                            day: day,
                            active: false,
                            startTime: '----',
                            endTime: '----',
                          }))
                        )
                      }}
                    >
                      {t('cancel')}
                    </Button>
                    <Button variant='default' type='submit'>
                      {editingGroup ? t('updateGroup') : t('saveGroup')}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
