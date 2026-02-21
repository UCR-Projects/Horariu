import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Day } from '@/types'
import { START_TIMES } from '@/utils/constants'
import { useI18n } from '@/hooks/useI18n'
import { useTimeValidation } from '@/hooks/useTimeValidation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface TimeRangeSelectorProps {
  day: Day
  blockIndex: number
  startTime: string
  endTime: string
  onChange: (day: Day, blockIndex: number, startTime: string, endTime: string) => void
  onRemove: (day: Day, blockIndex: number) => void
  canRemove: boolean
  disabled?: boolean
}

const TimeRangeSelector = ({
  day,
  blockIndex,
  startTime = '----',
  endTime = '----',
  onChange,
  onRemove,
  canRemove,
  disabled = false,
}: TimeRangeSelectorProps) => {
  const { t } = useI18n()
  const { validEndTimes, isEndTimeValid, getValidatedEndTime } = useTimeValidation({ startTime })

  // Reset end time if it becomes invalid after start time change
  useEffect(() => {
    if (startTime !== '----' && endTime !== '----') {
      if (!isEndTimeValid(startTime, endTime)) {
        onChange(day, blockIndex, startTime, '----')
      }
    }
  }, [startTime, endTime, day, blockIndex, onChange, isEndTimeValid])

  const dayName = t(`days.${day}.name`)
  const startTimeId = `start-time-${day}-${blockIndex}`
  const endTimeId = `end-time-${day}-${blockIndex}`

  return (
    <div className="relative flex items-center justify-center gap-2 mb-2" role="group" aria-label={t('accessibility.timeBlockFor', { day: dayName, block: blockIndex + 1 })}>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <label htmlFor={startTimeId} className="text-xs italic text-neutral-500">{t('time.from')}:</label>
          <Select
            disabled={disabled}
            value={startTime}
            onValueChange={(value) => {
              const newEndTime = getValidatedEndTime(value, endTime)
              onChange(day, blockIndex, value, newEndTime)
            }}
          >
            <SelectTrigger id={startTimeId} className="w-24 cursor-pointer text-sm" aria-label={t('accessibility.startTime')}>
              <SelectValue placeholder="----">{startTime}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="----">----</SelectItem>
              {START_TIMES.map((time) => (
                <SelectItem className="cursor-pointer" key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <label htmlFor={endTimeId} className="text-xs italic text-neutral-500">{t('time.to')}:</label>
          <Select
            disabled={disabled || startTime === '----'}
            value={endTime}
            onValueChange={(value) => {
              onChange(day, blockIndex, startTime, value)
            }}
          >
            <SelectTrigger id={endTimeId} className="w-24 cursor-pointer text-sm" aria-label={t('accessibility.endTime')}>
              <SelectValue placeholder="----">{endTime}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {validEndTimes.map((time) => (
                <SelectItem className="cursor-pointer" key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {canRemove && (
        <div className="absolute right-0 w-8 h-8 flex items-center justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(day, blockIndex)}
            aria-label={t('accessibility.removeTimeBlock', { day: dayName, block: blockIndex + 1 })}
            className="h-8 w-8 hover:bg-neutral-200 dark:hover:bg-neutral-900/80 cursor-pointer"
          >
            <Trash2 className="h-4 w-4 text-neutral-600" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default TimeRangeSelector
