import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Day } from '@/types'
import { GroupFormValuesType } from '@/validation/schemas/course.schema'

type DaySchedule = {
  day: Day
  active: boolean
  timeBlocks: { start: string; end: string }[]
}

interface UseScheduleHandlersOptions {
  form: UseFormReturn<GroupFormValuesType>
}

interface UseScheduleHandlersReturn {
  handleDayToggle: (day: Day, active: boolean) => void
  handleAddTimeBlock: (day: Day) => void
  handleRemoveTimeBlock: (day: Day, blockIndex: number) => void
  handleTimeBlockChange: (day: Day, blockIndex: number, start: string, end: string) => void
}

/**
 * Hook for managing schedule manipulation in the group form.
 * Provides handlers for toggling days, adding/removing time blocks, and updating times.
 */
export function useScheduleHandlers({
  form,
}: UseScheduleHandlersOptions): UseScheduleHandlersReturn {
  const handleDayToggle = useCallback(
    (day: Day, active: boolean) => {
      const currentSchedules = form.getValues('schedules')
      const updatedSchedules = currentSchedules.map((schedule: DaySchedule) =>
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
    },
    [form]
  )

  const handleAddTimeBlock = useCallback(
    (day: Day) => {
      const currentSchedules = form.getValues('schedules')
      const updatedSchedules = currentSchedules.map((schedule: DaySchedule) =>
        schedule.day === day
          ? {
              ...schedule,
              timeBlocks: [...schedule.timeBlocks, { start: '----', end: '----' }],
            }
          : schedule
      )
      form.setValue('schedules', updatedSchedules)
    },
    [form]
  )

  const handleRemoveTimeBlock = useCallback(
    (day: Day, blockIndex: number) => {
      const currentSchedules = form.getValues('schedules')
      const updatedSchedules = currentSchedules.map((schedule: DaySchedule) =>
        schedule.day === day
          ? {
              ...schedule,
              timeBlocks: schedule.timeBlocks.filter((_, index) => index !== blockIndex),
            }
          : schedule
      )
      form.setValue('schedules', updatedSchedules)
    },
    [form]
  )

  const handleTimeBlockChange = useCallback(
    (day: Day, blockIndex: number, start: string, end: string) => {
      const currentSchedules = form.getValues('schedules')
      const updatedSchedules = currentSchedules.map((schedule: DaySchedule) =>
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
    },
    [form]
  )

  return {
    handleDayToggle,
    handleAddTimeBlock,
    handleRemoveTimeBlock,
    handleTimeBlockChange,
  }
}

