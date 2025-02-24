import WeekDaySelector from './WeekDaySelector'
import { Schedule, Day } from '../types'
import useCourseStore from '../stores/useCourseStore'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { START_TIMES, END_TIMES } from '../utils/constants'
import { SelectorArrowIcon } from '../assets/icons/Icons'

interface TimeRangeSelectorProps {
  groupName: string
  day: Day
  initialStart: string
  initialEnd: string
}

const TimeRangeSelector = ({
  groupName,
  day,
  initialStart = '----',
  initialEnd = '----',
}: TimeRangeSelectorProps) => {
  const [selectedStart, setSelectedStart] = useState(initialStart)
  const [selectedEnd, setSelectedEnd] = useState(initialEnd)

  const { updateSchedule } = useCourseStore()

  // Generate end time options based on selected start time
  const getValidEndTimes = (startTime: string) => {
    if (startTime === '----') return ['----']

    const startIndex = START_TIMES.indexOf(startTime)
    return ['----', ...END_TIMES.slice(startIndex)] // Add '----' as first option
  }
  const endTimes = getValidEndTimes(selectedStart)

  useEffect(() => {
    // Update selected end time if it's invalid
    if (selectedStart === '----') {
      setSelectedEnd('----')
      updateSchedule(groupName, day, '----', '----')
    } else if (selectedEnd !== '----') {
      const startIndex = START_TIMES.indexOf(selectedStart)
      const endIndex = END_TIMES.indexOf(selectedEnd)

      if (endIndex < startIndex) {
        setSelectedEnd('----')
        updateSchedule(groupName, day, selectedStart, '----')
      }
    }
  }, [selectedStart, selectedEnd, groupName, day, updateSchedule])
  return (
    <div className='flex items-center gap-2'>
      <div className='relative'>
        <select
          value={selectedStart}
          onChange={(e) => {
            setSelectedStart(e.target.value)
            updateSchedule(groupName, day, e.target.value, selectedEnd)
          }}
          className='w-24 p-2 bg-gray-800 text-white rounded appearance-none 
            cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500'
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
          onChange={(e) => {
            setSelectedEnd(e.target.value)
            updateSchedule(groupName, day, selectedStart, e.target.value)
          }}
          className='w-24 p-2 bg-gray-800 text-white rounded appearance-none
            cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          {endTimes.map((time) => (
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

const GroupTimetableEditor = ({ groupName }: { groupName: string }) => {
  const { t } = useTranslation()
  const { selectedCourse, selectedGroup, selectedDays } = useCourseStore()

  if (!selectedGroup || selectedGroup.name !== groupName) return null

  return (
    <div className='w-full pt-2'>
      <WeekDaySelector />
      {selectedDays.map((day) => {
        const schedule = (
          selectedCourse?.groups.find((g) => g.name === groupName)
            ?.schedule as Schedule
        )[day] || { start: '----', end: '----' }

        return (
          <div key={day} className='flex items-center my-2 px-2'>
            <span className='w-24 text-left'>{t(`days.${day}.name`)}</span>
            <TimeRangeSelector
              groupName={groupName}
              day={day}
              initialStart={schedule.start}
              initialEnd={schedule.end}
            />
          </div>
        )
      })}
    </div>
  )
}

export default GroupTimetableEditor
