interface WeekDayProps {
  onDayToggle: (day: string) => void
  selectedDays: string[]
}

const WeekDaySelector = ({ onDayToggle, selectedDays }: WeekDayProps) => {
  const weekDays = [
    { key: 'L', label: 'L' },
    { key: 'K', label: 'K' },
    { key: 'M', label: 'M' },
    { key: 'J', label: 'J' },
    { key: 'V', label: 'V' },
    { key: 'S', label: 'S' },
    { key: 'D', label: 'D' },
  ]

  return (
    <div className='flex justify-between w-full py-2'>
      {weekDays.map((day) => (
        <button
          key={day.key}
          onClick={() => onDayToggle(day.key)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
            ${selectedDays.includes(day.key) ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          {day.label}
        </button>
      ))}
    </div>
  )
}

export default WeekDaySelector
