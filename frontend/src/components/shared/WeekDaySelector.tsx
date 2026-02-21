import { Day } from '@/types'
import { useI18n } from '@/hooks/useI18n'

interface WeekDaySelectorProps {
  day: Day
  active: boolean
  onToggle: (active: boolean) => void
  disabled?: boolean
}

const WeekDaySelector = ({ day, active, onToggle, disabled = false }: WeekDaySelectorProps) => {
  const { t } = useI18n()

  const dayName = t(`days.${day}.name`)
  const dayShort = t(`days.${day}.short`)

  return (
    <button
      type="button"
      onClick={() => onToggle(!active)}
      disabled={disabled}
      aria-label={active ? t('accessibility.deselectDay', { day: dayName }) : t('accessibility.selectDay', { day: dayName })}
      aria-pressed={active}
      className={`transition-colors rounded-full w-8 h-8 flex items-center justify-center dark:hover:bg-neutral-800/20 hover:bg-neutral-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        active
          ? 'text-sky-500 font-extrabold dark:bg-neutral-800/20 bg-neutral-100'
          : 'dark:text-neutral-300'
      }`}
    >
      {dayShort}
    </button>
  )
}

export default WeekDaySelector
