import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2, Calendar } from 'lucide-react'
import { useGenerateSchedule } from '@/hooks/useGenerateSchedule'
import useScheduleStore from '@/stores/useScheduleStore'
import useCourseStore from '@/stores/useCourseStore'
import { useI18n } from '@/hooks/useI18n'
import { useMemo, useState } from 'react'

const GenerateScheduleButton = () => {
  const { t } = useI18n(['common', 'courses', 'schedules'])
  const { generateSchedule, getIgnoredLinks } = useGenerateSchedule()
  const isLoading = useScheduleStore((state) => state.isLoading)
  const courses = useCourseStore((state) => state.courses)

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [ignoredLinksToConfirm, setIgnoredLinksToConfirm] = useState<string[]>([])

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

  const handleGenerateClick = () => {
    const ignoredLinks = getIgnoredLinks(activeCoursesWithActiveGroups)

    if (ignoredLinks.length > 0) {
      // Show confirmation dialog
      setIgnoredLinksToConfirm(ignoredLinks)
      setShowConfirmDialog(true)
    } else {
      // Generate directly
      generateSchedule(activeCoursesWithActiveGroups)
    }
  }

  const handleConfirmGenerate = () => {
    setShowConfirmDialog(false)
    generateSchedule(activeCoursesWithActiveGroups)
  }

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
      onClick={handleGenerateClick}
      disabled={isDisabled}
      className="w-full md:w-auto px-4 py-2 font-medium disabled:text-muted-foreground disabled:bg-muted cursor-pointer"
    >
      {buttonContent}
    </Button>
  )

  const confirmDialog = (
    <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('schedules:ignoredLinksDialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('schedules:ignoredLinksDialog.description')}
            <ul className="mt-2 list-disc list-inside">
              {ignoredLinksToConfirm.map((link) => (
                <li key={link} className="font-medium">{link}</li>
              ))}
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">{t('common:actions.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmGenerate} className="cursor-pointer">
            {t('schedules:ignoredLinksDialog.continue')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
      <>
        {confirmDialog}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="w-full md:w-auto">{button}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipMessage}</p>
          </TooltipContent>
        </Tooltip>
      </>
    )
  }

  return (
    <>
      {confirmDialog}
      {button}
    </>
  )
}

export default GenerateScheduleButton
