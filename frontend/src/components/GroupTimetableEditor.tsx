import WeekDaySelector from './WeekDaySelector'
import { Schedule } from '../types'
import useCourseStore from '../stores/useCourseStore'
import { useTranslation } from 'react-i18next'

const GroupTimetableEditor = ({ groupName }: { groupName: string }) => {
  const { t } = useTranslation()
  const { selectedCourse, selectedGroup, selectedDays, updateSchedule } =
    useCourseStore()

  if (!selectedGroup || selectedGroup.name !== groupName) return null

  return (
    <div className='w-full pt-2'>
      <WeekDaySelector />

      {selectedDays.map((day) => {
        const schedule = (
          selectedCourse?.groups.find((g) => g.name === groupName)
            ?.schedule as Schedule
        )[day] || { start: '07:00', end: '08:50' }

        return (
          <div key={day} className='flex items-center my-2'>
            <span className='w-24 text-left'>{t(`days.${day}.name`)}</span>

            <input
              type='time'
              defaultValue={schedule.start}
              className='mx-2 p-2 bg-gray-700 rounded'
              onChange={(e) =>
                updateSchedule(groupName, day, e.target.value, schedule.end)
              }
            />
            <input
              type='time'
              defaultValue={schedule.end}
              className='mx-2 p-2 bg-gray-700 rounded'
              onChange={(e) =>
                updateSchedule(groupName, day, schedule.start, e.target.value)
              }
            />
          </div>
        )
      })}
    </div>
  )
}

export default GroupTimetableEditor
