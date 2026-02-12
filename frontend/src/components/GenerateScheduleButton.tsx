import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader2, Calendar } from 'lucide-react'
import { useGenerateSchedule } from '@/hooks/useGenerateSchedule'
import useScheduleStore from '@/stores/useScheduleStore'
import useCourseStore from '@/stores/useCourseStore'
import { useI18n } from '@/hooks/useI18n'

const GenerateScheduleButton = () => {
  const { t } = useI18n(['common', 'courses', 'schedules'])
  const { generateSchedule } = useGenerateSchedule()
  const isLoading = useScheduleStore((state) => state.isLoading)
  const courses = useCourseStore((state) => state.courses)

  const activeCoursesWithActiveGroups = courses
    .filter((course) => course.isActive)
    .map((course) => ({
      ...course,
      groups: course.groups.filter((group) => group.isActive),
    }))
    .filter((course) => course.groups.length > 0)

  const hasCourses = courses.length > 0
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
      className="w-full md:w-auto px-4 py-2 font-medium disabled:text-neutral-400 disabled:bg-neutral-900 cursor-pointer"
    >
      {buttonContent}
    </Button>
  )

  let tooltipMessage = ''
  if (!hasCourses) {
    tooltipMessage = t('courses:validation.mustAddACourse')
  } else if (!hasActiveCoursesWithGroups) {
    const activeCourses = courses.filter((c) => c.isActive)
    if (activeCourses.length === 0) {
      tooltipMessage = t('courses:validation.mustHaveActiveCourses')
    } else {
      tooltipMessage = t('courses:validation.mustHaveActiveGroups')
    }
  }

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
