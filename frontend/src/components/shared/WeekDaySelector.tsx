import { Day } from '@/types'
import { useI18n } from '@/hooks/useI18n'
import { tokens } from '@/styles'

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
      className={`transition-colors rounded-full ${tokens.interactive.md} flex items-center justify-center hover:bg-interactive-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        active
          ? 'text-sky-500 font-extrabold bg-interactive-subtle'
          : 'text-muted-foreground'
      }`}
    >
      {dayShort}
    </button>
  )
}

export default WeekDaySelector
