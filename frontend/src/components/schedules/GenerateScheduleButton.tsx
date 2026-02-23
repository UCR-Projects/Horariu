import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader2, Calendar } from 'lucide-react'
import { useGenerateSchedule } from '@/hooks/useGenerateSchedule'
import useScheduleStore from '@/stores/useScheduleStore'
import useCourseStore from '@/stores/useCourseStore'
import { useI18n } from '@/hooks/useI18n'
import { useMemo } from 'react'

const GenerateScheduleButton = () => {
  const { t } = useI18n(['common', 'courses', 'schedules'])
  const { generateSchedule } = useGenerateSchedule()
  const isLoading = useScheduleStore((state) => state.isLoading)
  const courses = useCourseStore((state) => state.courses)

  // Memoize derived state to prevent recalculation on every render
  const activeCoursesWithActiveGroups = useMemo(
    () =>
      courses
        .filter((course) => course.isActive)
        .map((course) => ({
          ...course,
          groups: course.groups.filter((group) => group.isActive),
        }))
        .filter((course) => course.groups.length > 0),
    [courses]
  )

  const hasCourses = courses.length > 0
  const hasActiveCourses = courses.some((course) => course.isActive)
  const hasActiveCoursesWithGroups = activeCoursesWithActiveGroups.length > 0
  const isDisabled = !hasActiveCoursesWithGroups || isLoading

  const buttonContent = isLoading ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      {t('common:actions.generating')}...
    </>
  ) : (
    <>
      <Calendar className="mr-2 h-5 w-5" />
      {t('schedules:generateSchedules')}
    </>
  )

  const button = (
    <Button
      onClick={() => generateSchedule(activeCoursesWithActiveGroups)}
      disabled={isDisabled}
      className="w-full md:w-auto px-4 py-2 font-medium disabled:text-muted-foreground disabled:bg-muted cursor-pointer"
    >
      {buttonContent}
    </Button>
  )

  const getTooltipMessage = (): string => {
    if (!hasCourses) return t('courses:validation.mustAddACourse')
    if (!hasActiveCourses) return t('courses:validation.mustHaveActiveCourses')
    if (!hasActiveCoursesWithGroups) return t('courses:validation.mustHaveActiveGroups')
    return ''
  }

  const tooltipMessage = getTooltipMessage()

  if (tooltipMessage) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="w-full md:w-auto">{button}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
}

export default GenerateScheduleButton
