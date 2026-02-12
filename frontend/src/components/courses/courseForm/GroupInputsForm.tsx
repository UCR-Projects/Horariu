import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { DAYS } from '@/utils/constants'
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
import { useI18n } from '@/hooks/useI18n'
import { useScheduleHandlers } from '@/hooks/useScheduleHandlers'
import { TimeRangeSelector, WeekDaySelector, ResponsiveFormWrapper } from '@/components/shared'
import { Plus } from 'lucide-react'

interface GroupFormProps {
  form: UseFormReturn<GroupFormValuesType>
  isEditing: boolean
  onSubmit: (values: GroupFormValuesType) => void
  onCancel: () => void
}

export function GroupInputsForm({ form, isEditing, onSubmit, onCancel }: GroupFormProps) {
  const { t } = useI18n(['common', 'courses'])

  const { handleDayToggle, handleAddTimeBlock, handleRemoveTimeBlock, handleTimeBlockChange } =
    useScheduleHandlers({ form })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit(onSubmit)(e)
  }

  // Get the active days from the group form
  const activeDays = form.watch('schedules')?.filter((s) => s.active) || []

  const formContent = (
    <Form {...form}>
      <form
        id="groupForm"
        onSubmit={handleFormSubmit}
        className="space-y-4 overflow-y-auto max-h-[70vh]"
      >
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">{t('courses:groupName')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('courses:groupName')}
                  {...field}
                  className="text-sm py-2"
                  maxLength={25}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel className="text-sm">{t('courses:schedule')}</FormLabel>

          {form.formState.errors.schedules?.message && (
            <div className="text-red-500 text-sm">{form.formState.errors.schedules?.message}</div>
          )}

          <div className="space-y-1 pt-2">
            {/* Days Selector */}
            <div className="flex justify-between w-full py-2">
              {DAYS.map((day) => {
                const schedule = form.watch('schedules').find((s) => s.day === day)
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
              <div className="border-t pt-2 mt-2">
                <div className="p-2 rounded">
                  {activeDays.map((schedule) => (
                    <div key={schedule.day} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">
                          {t(`common:days.${schedule.day}.name`)}
                        </h4>
                        <div
                          onClick={() => handleAddTimeBlock(schedule.day)}
                          className="flex items-center gap-1 text-xs text-neutral-500 dark:hover:text-neutral-300 cursor-pointer transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          <span className="text-xs">{t('courses:addTimeBlock')}</span>
                        </div>
                      </div>

                      {schedule.timeBlocks.length === 0 ? (
                        <div className="text-xs text-neutral-500 italic text-center border border-dashed rounded p-4">
                          {t('courses:noTimeBlocks')}
                        </div>
                      ) : (
                        <div className="space-y-2">
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
              <div className="text-xs text-neutral-500 italic text-center border-t pt-3">
                {t('courses:noActiveDays')}
              </div>
            )}
          </div>
        </div>
      </form>
    </Form>
  )

  const footerButtons = (
    <div className="flex justify-between space-x-3 mt-4">
      <Button type="button" variant="outline" className="cursor-pointer" onClick={onCancel}>
        {t('common:actions.cancel')}
      </Button>
      <Button type="submit" form="groupForm" className="cursor-pointer">
        {t('common:actions.save')}
      </Button>
    </div>
  )

  return (
    <ResponsiveFormWrapper
      title={isEditing ? t('courses:editGroup') : t('courses:newGroup')}
      description={isEditing ? t('courses:editGroupFormDes') : t('courses:groupFormDes')}
      footer={footerButtons}
    >
      {formContent}
    </ResponsiveFormWrapper>
  )
}
