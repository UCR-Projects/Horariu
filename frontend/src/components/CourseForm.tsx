import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { courseSchema, groupSchema } from '@/validation/schemas/course.schema'
import TimeRangeSelector from './TimeRangeSelector'
import WeekDaySelector from './WeekDaySelector'
import { validMsgs } from '@/validation/validationMessages'
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
import { DAYS } from '@/utils/constants'
import ColorPicker from './ColorPicker'
import { Day, Group, Schedule } from '@/types'
import { useTranslation } from 'react-i18next'
import useCourseStore from '@/stores/useCourseStore'

interface ScheduleGroupForm {
  day: Day
  active: boolean
  startTime: string
  endTime: string
}

export default function CourseFormDialog() {
  const { t } = useTranslation()
  const { addCourse } = useCourseStore()
  const [selectedColor, setSelectedColor] = useState('bg-red-500')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeStep, setActiveStep] = useState<'course' | 'group'>('course')
  const [groups, setGroups] = useState<
    { name: string; schedule: ScheduleGroupForm[] }[]
  >([])
  const [schedules, setSchedules] = useState<ScheduleGroupForm[]>(
    DAYS.map((day) => ({
      day: day,
      active: false,
      startTime: '----',
      endTime: '----',
    }))
  )

  const courseForm = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseName: '',
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
      (group) => group.name === values.groupName
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
        type: 'manual',
        message: validMsgs.group.schedule.timeRange,
      })
      return
    }

    const newGroup = {
      name: values.groupName,
      schedule: schedules.filter((s) => s.active),
    }

    setGroups([...groups, newGroup])
    groupForm.reset()

    // Reset schedules
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

  function onSubmitCourse(values: z.infer<typeof courseSchema>) {
    if (groups.length === 0) {
      return
    }

    const formattedGroups: Group[] = groups.map((group) => ({
      name: group.name,
      schedule: group.schedule.reduce((acc, curr) => {
        acc[curr.day] = {
          start: curr.startTime,
          end: curr.endTime,
        }
        return acc
      }, {} as Schedule),
    }))

    addCourse({
      name: values.courseName,
      color: selectedColor,
      groups: formattedGroups,
    })

    courseForm.reset()
    setGroups([])
    setIsDialogOpen(false)
    setSelectedColor('bg-red-500')
  }

  const activeDays = schedules.filter((s) => s.active)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>{t('addCourse')}</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        {activeStep === 'course' && (
          <>
            <DialogHeader>
              <DialogTitle className='text-lg'>{t('newCourse')}</DialogTitle>
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

                <ColorPicker onChange={setSelectedColor} />

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
                    <div className='border rounded-md p-2 max-h-32 overflow-y-auto'>
                      <ul className='space-y-1'>
                        {groups.map((group, index) => (
                          <li key={index} className='py-1'>
                            <div className='font-medium text-sm'>
                              {group.name}
                            </div>
                            {group.schedule.length > 0 && (
                              <div className='ml-2 text-xs text-neutral-500'>
                                {group.schedule.map((s, i) => (
                                  <div key={i} className='truncate'>
                                    {s.day}: {s.startTime} - {s.endTime}
                                  </div>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
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
              <DialogTitle className='text-lg'>{t('newGroup')}</DialogTitle>
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
                      onClick={() => setActiveStep('course')}
                    >
                      {t('cancel')}
                    </Button>
                    <Button variant='default' type='submit'>
                      Save Group
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
