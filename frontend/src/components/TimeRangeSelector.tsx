import { useState, useEffect } from 'react'
import { START_TIMES, END_TIMES } from '../utils/constants'
import { SelectorArrowIcon } from '../assets/icons/Icons'
import { Day } from '../types'

interface TimeRangeSelectorProps {
  groupName: string
  day: Day
  initialStart: string
  initialEnd: string
  onTimeChange: (
    groupName: string,
    day: Day,
    start: string,
    end: string
  ) => void
}

const TimeRangeSelector = ({
  groupName,
  day,
  onTimeChange,
  initialStart = '----',
  initialEnd = '----',
}: TimeRangeSelectorProps) => {
  const [selectedStart, setSelectedStart] = useState(initialStart)
  const [selectedEnd, setSelectedEnd] = useState(initialEnd)

  // Generate end time options based on selected start time
  const getValidEndTimesOptions = (startTime: string) => {
    if (startTime === '----') return ['----']

    const startIndex = START_TIMES.indexOf(startTime)
    return ['----', ...END_TIMES.slice(startIndex)] // Add '----' as first option of end time and slice the array from startIndex
  }

  const endTimesOptions = getValidEndTimesOptions(selectedStart)

  // Reset selected end time if it's not a valid option
  useEffect(() => {
    if (!endTimesOptions.includes(selectedEnd)) {
      setSelectedEnd('----')
      onTimeChange(groupName, day, selectedStart, '----')
    }
  }, [
    selectedStart,
    endTimesOptions,
    selectedEnd,
    groupName,
    day,
    onTimeChange,
  ])

  const handleStartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStart(e.target.value)
  }

  const handleEndChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEnd(e.target.value)
    onTimeChange(groupName, day, selectedStart, e.target.value)
  }

  return (
    <div className='flex items-center gap-2'>
      <div className='relative'>
        <select
          value={selectedStart}
          onChange={handleStartChange}
          className='w-24 p-2 bg-zinc-800 text-white rounded appearance-none 
            cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-500'
        >
          <option value='----'>----</option>
          {START_TIMES.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <div className='absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none'>
          <SelectorArrowIcon />
        </div>
      </div>

      <div className='relative'>
        <select
          value={selectedEnd}
          onChange={handleEndChange}
          className='w-24 p-2 bg-zinc-800 text-white rounded appearance-none
            cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-70'
          disabled={selectedStart === '----'}
        >
          {endTimesOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <div className='absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none'>
          <SelectorArrowIcon />
        </div>
      </div>
    </div>
  )
}

export default TimeRangeSelector
