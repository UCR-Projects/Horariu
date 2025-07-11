import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { DAYS } from '@/utils/constants'
import TimeRangeSelector from '@/components/TimeRangeSelector'
import WeekDaySelector from '@/components/WeekDaySelector'
import { GroupFormValuesType } from '@/validation/schemas/course.schema'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

import { useIsMobile } from '@/hooks/use-mobile'
import { Day } from '@/types'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

interface GroupFormProps {
  form: UseFormReturn<GroupFormValuesType>
  isEditing: boolean
  onSubmit: (values: GroupFormValuesType) => void
  onCancel: () => void
}

export function GroupInputsForm({
  form,
  isEditing,
  onSubmit,
  onCancel,
}: GroupFormProps) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const handleDayToggle = (day: Day, active: boolean) => {
    const currentSchedules = form.getValues('schedules')
    const updatedSchedules = currentSchedules.map((schedule) =>
      schedule.day === day
        ? {
            ...schedule,
            active,
            timeBlocks: active
              ? schedule.timeBlocks.length > 0
                ? schedule.timeBlocks
                : [{ start: '----', end: '----' }]
              : [],
          }
        : schedule
    )
    form.setValue('schedules', updatedSchedules)
  }

  const handleAddTimeBlock = (day: Day) => {
    const currentSchedules = form.getValues('schedules')
    const updatedSchedules = currentSchedules.map((schedule) =>
      schedule.day === day
        ? {
            ...schedule,
            timeBlocks: [
              ...schedule.timeBlocks,
              { start: '----', end: '----' },
            ],
          }
        : schedule
    )
    form.setValue('schedules', updatedSchedules)
  }

  const handleRemoveTimeBlock = (day: Day, blockIndex: number) => {
    const currentSchedules = form.getValues('schedules')
    const updatedSchedules = currentSchedules.map((schedule) =>
      schedule.day === day
        ? {
            ...schedule,
            timeBlocks: schedule.timeBlocks.filter(
              (_, index) => index !== blockIndex
            ),
          }
        : schedule
    )
    form.setValue('schedules', updatedSchedules)
  }

  const handleTimeBlockChange = (
    day: Day,
    blockIndex: number,
    start: string,
    end: string
  ) => {
    const currentSchedules = form.getValues('schedules')
    const updatedSchedules = currentSchedules.map((schedule) =>
      schedule.day === day
        ? {
            ...schedule,
            timeBlocks: schedule.timeBlocks.map((block, index) =>
              index === blockIndex ? { start, end } : block
            ),
          }
        : schedule
    )
    form.setValue('schedules', updatedSchedules)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit(onSubmit)(e)
  }

  // Get the active days from the group form
  const activeDays = form.watch('schedules')?.filter((s) => s.active) || []

  const formContent = (
    <Form {...form}>
      <form
        id='groupForm'
        onSubmit={handleFormSubmit}
        className='space-y-4 overflow-y-auto max-h-[70vh]'
      >
        <FormField
          control={form.control}
          name='groupName'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm'>{t('groupName')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('groupName')}
                  {...field}
                  className='text-sm py-2'
                  maxLength={25}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-2'>
          <FormLabel className='text-sm'>{t('schedule')}</FormLabel>

          {form.formState.errors.schedules?.message && (
            <div className='text-red-500 text-sm'>
              {form.formState.errors.schedules?.message}
            </div>
          )}

          <div className='space-y-1 pt-2'>
            {/* Days Selector */}
            <div className='flex justify-between w-full py-2'>
              {DAYS.map((day) => {
                const schedule = form
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
                  {activeDays.map((schedule) => (
                    <div key={schedule.day} className='mb-4 last:mb-0'>
                      <div className='flex items-center justify-between mb-2'>
                        <h4 className='font-medium text-sm'>
                          {t(`days.${schedule.day}.name`)}
                        </h4>
                        <div
                          onClick={() => handleAddTimeBlock(schedule.day)}
                          className='flex items-center gap-1 text-xs text-neutral-500 dark:hover:text-neutral-300 cursor-pointer transition-colors'
                        >
                          <Plus className='h-3 w-3' />
                          <span className='text-xs'>{t('addTimeBlock')}</span>
                        </div>
                      </div>

                      {schedule.timeBlocks.length === 0 ? (
                        <div className='text-xs text-neutral-500 italic text-center border border-dashed rounded p-4'>
                          {t('noTimeBlocks')}
                        </div>
                      ) : (
                        <div className='space-y-2'>
                          {schedule.timeBlocks.map((block, blockIndex) => (
                            <TimeRangeSelector
                              key={`${schedule.day}-${blockIndex}`}
                              day={schedule.day}
                              blockIndex={blockIndex}
                              startTime={block.start}
                              endTime={block.end}
                              onChange={handleTimeBlockChange}
                              onRemove={handleRemoveTimeBlock}
                              canRemove={schedule.timeBlocks.length > 1}
                            />
                          ))}
                        </div>
                      )}
                    </div>
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
      </form>
    </Form>
  )

  const footerButtons = (
    <div className='flex justify-between space-x-3 mt-4'>
      <Button
        type='button'
        variant='outline'
        className='cursor-pointer'
        onClick={onCancel}
      >
        {t('cancel')}
      </Button>
      <Button type='submit' form='groupForm' className='cursor-pointer'>
        {t('save')}
      </Button>
    </div>
  )

  return (
    <>
      {isMobile ? (
        <>
          <DrawerHeader>
            <DrawerTitle className='text-lg'>
              {isEditing ? t('editGroup') : t('newGroup')}
            </DrawerTitle>
            <DrawerDescription className='text-sm'>
              {isEditing ? t('editGroupFormDes') : t('groupFormDes')}
            </DrawerDescription>
          </DrawerHeader>
          {formContent}
          <DrawerFooter>{footerButtons}</DrawerFooter>
        </>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle className='text-lg'>
              {isEditing ? t('editGroup') : t('newGroup')}
            </DialogTitle>
            <DialogDescription className='text-sm'>
              {isEditing ? t('editGroupFormDes') : t('groupFormDes')}
            </DialogDescription>
          </DialogHeader>
          {formContent}
          <DialogFooter>{footerButtons}</DialogFooter>
        </>
      )}
    </>
  )
}
