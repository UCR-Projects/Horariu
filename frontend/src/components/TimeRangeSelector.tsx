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
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'

interface TimeRangeSelectorProps {
  day: Day
  blockIndex: number
  startTime: string
  endTime: string
  onChange: (
    day: Day,
    blockIndex: number,
    startTime: string,
    endTime: string
  ) => void
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
  const { t } = useTranslation()

  const getValidEndTimes = (start: string) => {
    if (!start || start === '----') return ['----']
    const startIndex = START_TIMES.indexOf(start)
    return ['----', ...END_TIMES.slice(startIndex)]
  }

  const validEndTimes = getValidEndTimes(startTime)

  const isEndTimeValid = (start: string, end: string) => {
    if (end === '----') return true
    if (start === '----') return false

    const startIndex = START_TIMES.indexOf(start)
    const endIndex = END_TIMES.indexOf(end)

    return endIndex >= startIndex
  }

  useEffect(() => {
    if (startTime !== '----' && endTime !== '----') {
      if (!isEndTimeValid(startTime, endTime)) {
        onChange(day, blockIndex, startTime, '----')
      }
    }
  }, [startTime, endTime, day, blockIndex, onChange])

  return (
    <div className='flex items-center gap-2 pl-2 mb-2'>
      <div className='w-20 text-xs text-neutral-500'>
        {blockIndex === 0 ? t('block') : `${t('block')} ${blockIndex + 1}`}
      </div>

      <Select
        disabled={disabled}
        value={startTime}
        onValueChange={(value) => {
          const newEndTime = isEndTimeValid(value, endTime) ? endTime : '----'
          onChange(
            day,
            blockIndex,
            value,
            value === '----' ? '----' : newEndTime
          )
        }}
      >
        <SelectTrigger className='w-24 cursor-pointer text-sm'>
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
          onChange(day, blockIndex, startTime, value)
        }}
      >
        <SelectTrigger className='w-24 cursor-pointer text-sm'>
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

      <div className='w-8 h-8 flex items-center justify-center'>
        {canRemove && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => onRemove(day, blockIndex)}
            className='h-8 w-8 p-0 hover:bg-accent transition-colors cursor-pointer'
          >
            <Trash2 className='h-4 w-4 text-neutral-600' />
          </Button>
        )}
      </div>
    </div>
  )
}

export default TimeRangeSelector
