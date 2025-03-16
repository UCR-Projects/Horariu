import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Day } from '@/types'
import { START_TIMES, END_TIMES } from '@/utils/constants'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

interface TimeRangeSelectorProps {
  day: Day
  startTime: string
  endTime: string
  onChange: (day: Day, startTime: string, endTime: string) => void
  disabled?: boolean
}

const TimeRangeSelector = ({
  day,
  startTime = '----',
  endTime = '----',
  onChange,
  disabled = false,
}: TimeRangeSelectorProps) => {
  const { t } = useTranslation()

  // Generate end time options based on selected start time
  const getValidEndTimes = (start: string) => {
    if (!start || start === '----') return ['----']
    const startIndex = START_TIMES.indexOf(start)
    return ['----', ...END_TIMES.slice(startIndex)] // Add '----' as first option
  }

  const validEndTimes = getValidEndTimes(startTime)

  // Check if the current endTime is valid for the selected startTime
  const isEndTimeValid = (start: string, end: string) => {
    if (end === '----') return true
    if (start === '----') return false

    const startIndex = START_TIMES.indexOf(start)
    const endIndex = END_TIMES.indexOf(end)

    return endIndex >= startIndex
  }

  // Validate the initial endTime value when component mounts
  // or when startTime changes
  useEffect(() => {
    if (startTime !== '----' && endTime !== '----') {
      if (!isEndTimeValid(startTime, endTime)) {
        onChange(day, startTime, '----')
      }
    }
  }, [startTime, endTime, day, onChange])

  return (
    <div className='flex items-center gap-2 mb-3'>
      <div className='w-24 '>{t(`days.${day}.name`)}</div>
      <Select
        disabled={disabled}
        value={startTime}
        onValueChange={(value) => {
          const newEndTime = isEndTimeValid(value, endTime) ? endTime : '----'
          onChange(day, value, value === '----' ? '----' : newEndTime)
        }}
      >
        <SelectTrigger className='w-24 cursor-pointer'>
          <SelectValue placeholder='----'>{startTime}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='----'>----</SelectItem>
          {START_TIMES.map((time) => (
            <SelectItem className='cursor-pointer' key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        disabled={disabled || startTime === '----'}
        value={endTime}
        onValueChange={(value) => {
          onChange(day, startTime, value)
        }}
      >
        <SelectTrigger className='w-24 cursor-pointer'>
          <SelectValue placeholder='----'>{endTime}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {validEndTimes.map((time) => (
            <SelectItem className='cursor-pointer' key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default TimeRangeSelector
