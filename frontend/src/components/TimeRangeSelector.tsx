import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Day } from '../types'
import { START_TIMES, END_TIMES } from '../utils/constants'
import { useTranslation } from 'react-i18next'

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

  return (
    <div className='flex items-center gap-2 mb-3'>
      <div className='w-24 font-medium'>{t(`days.${day}.name`)}</div>
      <Select
        disabled={disabled}
        value={startTime}
        onValueChange={(value) => {
          onChange(day, value, value === '----' ? '----' : endTime)
        }}
      >
        <SelectTrigger className='w-24'>
          <SelectValue placeholder='----' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='----'>----</SelectItem>
          {START_TIMES.map((time) => (
            <SelectItem key={time} value={time}>
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
        <SelectTrigger className='w-24'>
          <SelectValue placeholder='----' />
        </SelectTrigger>
        <SelectContent>
          {validEndTimes.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default TimeRangeSelector
