import { Day } from '../types'
import useCourseStore from '../stores/useCourseStore'
import { useTranslation } from 'react-i18next'

const WeekDaySelector = () => {
  const { t } = useTranslation()
  const { selectedDays, toggleDay } = useCourseStore()
  const days: Day[] = ['L', 'K', 'M', 'J', 'V', 'S', 'D']

  return (
    <div className='flex justify-between w-full py-2'>
      {days.map((day) => (
        <button
          key={day}
          onClick={() => toggleDay(day)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
            ${selectedDays.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          {t(`days.${day}.short`)}
        </button>
      ))}
    </div>
  )
}

export default WeekDaySelector
