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
import { Day } from '@/types'
import { useTranslation } from 'react-i18next'

interface ScheduleGroupForm {
  day: Day
  active: boolean
  startTime: string
  endTime: string
}

export default function CourseFormDialog() {
  const { t } = useTranslation()
  const [selectedColor, setSelectedColor] = useState('bg-red-500')
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false)
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [groups, setGroups] = useState<
    { name: string; schedule: ScheduleGroupForm[] }[]
  >([])
  const [groupError, setGroupError] = useState(false)
  const [schedules, setSchedules] = useState<ScheduleGroupForm[]>(
    DAYS.map((day) => ({
      day: day,
      active: false,
      startTime: '----',
      endTime: '----',
    }))
  )

  const form = useForm<z.infer<typeof courseSchema>>({
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

  const handleSaveGroup = (values: z.infer<typeof groupSchema>) => {
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
    setGroupError(false)
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

    setGroupDialogOpen(false)
  }

  function onSubmit(values: z.infer<typeof courseSchema>) {
    if (groups.length === 0) {
      setGroupError(true)
      return
    }

    console.log({
      ...values,
      color: selectedColor,
      groups: groups,
    })
    form.reset()
    setGroups([])
    setIsMainDialogOpen(false)
    setSelectedColor('bg-red-500')
    setGroupError(false)
  }

  const activeDays = schedules.filter((s) => s.active)

  return (
    <>
      <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsMainDialogOpen(true)}>Add Course</Button>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{t('newCourse')}</DialogTitle>
            <DialogDescription>{t('courseFormDescription')}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='courseName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('courseName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('courseName')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ColorPicker onChange={setSelectedColor} />

              {/* Group Section */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <FormLabel
                    className={`${groupError ? 'text-red-500' : 'text-foreground'}`}
                  >
                    {t('group')}s
                  </FormLabel>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setGroupDialogOpen(true)}
                  >
                    {t('addGroup')}
                  </Button>
                </div>

                {/* Added Groups list*/}
                {groups.length > 0 ? (
                  <div className='border rounded-md p-2'>
                    <ul>
                      {groups.map((group, index) => (
                        <li key={index} className='py-1'>
                          <div className='font-medium'>{group.name}</div>
                          {group.schedule.length > 0 && (
                            <div className='ml-2 text-sm text-neutral-500'>
                              {group.schedule.map((s, i) => (
                                <div key={i}>
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
                  <div className='text-sm text-neutral-500 italic'>
                    {t('noGroupsYet')}
                  </div>
                )}

                {/* Group validation error */}
                {groupError && (
                  <div className='text-sm text-red-500'>
                    {validMsgs.course.groupRequired}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type='submit'>{t('addCourse')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Group Dialog */}
      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{t('newGroup')}</DialogTitle>
            <DialogDescription>{t('groupFormDescription')}</DialogDescription>
          </DialogHeader>

          <Form {...groupForm}>
            <form
              onSubmit={groupForm.handleSubmit(handleSaveGroup)}
              className='space-y-6'
            >
              <FormField
                control={groupForm.control}
                name='groupName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Group Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='space-y-4'>
                <FormLabel
                  className={`${groupForm.formState.errors.schedule ? 'text-red-500' : 'text-foreground'}`}
                >
                  {t('schedule')}
                </FormLabel>

                <WeekDaySelector
                  schedules={schedules}
                  onToggleDay={handleDayToggle}
                />

                {/* Time selectors for ALL active days */}
                {activeDays.length > 0 ? (
                  <div className='border-t pt-3 mt-4'>
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
                  <div className='text-sm text-neutral-500 italic text-center border-t pt-3'>
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
                <Button type='submit'>Save Group</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
