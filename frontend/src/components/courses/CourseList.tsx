import CourseForm from './courseForm/CourseForm'
import { Button } from '@/components/ui/button'
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'
import { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useCourseStore from '@/stores/useCourseStore'
import useScheduleStore from '@/stores/useScheduleStore'
import { DeleteConfirmationDialog } from '@/components/shared'
import { Course, Group } from '@/types'
import { tokens } from '@/styles'

// ============================================================================
// GroupListItem - Renders a single group within a course
// ============================================================================

interface GroupListItemProps {
  group: Group
  courseName: string
  onToggleVisibility: () => void
}

const GroupListItem = memo(({ group, onToggleVisibility }: GroupListItemProps) => {
  const { t } = useI18n('courses')

  return (
    <div
      className={`flex items-center justify-between px-2 py-1 rounded text-sm ${
        !group.isActive ? 'opacity-50' : ''
      }`}
      role="listitem"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span
          className={`truncate max-w-full text-xs font-normal ${
            !group.isActive
              ? 'line-through text-muted-foreground'
              : 'text-muted-foreground'
          }`}
        >
          {group.name}
        </span>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={group.isActive ? t('accessibility.hideGroup', { groupName: group.name }) : t('accessibility.showGroup', { groupName: group.name })}
            aria-pressed={group.isActive}
            className={`${tokens.interactive.xs} hover:bg-accent cursor-pointer transition-colors shrink-0`}
            onClick={onToggleVisibility}
          >
            {group.isActive ? (
              <Eye className={`${tokens.icon.xs} text-icon-muted`} aria-hidden="true" />
            ) : (
              <EyeOff className={`${tokens.icon.xs} text-icon-muted`} aria-hidden="true" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {group.isActive ? t('visibility.excludeGroup') : t('visibility.includeGroup')}
        </TooltipContent>
      </Tooltip>
    </div>
  )
})

// ============================================================================
// CourseListItem - Renders a single course with its groups
// ============================================================================

interface CourseListItemProps {
  course: Course
  isExpanded: boolean
  onToggleExpansion: () => void
  onToggleCourseVisibility: () => void
  onToggleGroupVisibility: (groupName: string) => void
  onDeleteCourse: () => void
}

const CourseListItem = memo(
  ({
    course,
    isExpanded,
    onToggleExpansion,
    onToggleCourseVisibility,
    onToggleGroupVisibility,
    onDeleteCourse,
  }: CourseListItemProps) => {
    const { t } = useI18n('courses')
    const hasGroups = course.groups.length > 0

    return (
      <SidebarMenuItem className="group-data-[collapsible=icon]:hidden" role="listitem">
        <div
          className={`flex items-center justify-between w-full px-2 py-1.5 ${
            !course.isActive ? 'opacity-50' : ''
          } ${hasGroups ? 'cursor-pointer' : ''}`}
          onClick={() => hasGroups && onToggleExpansion()}
          role={hasGroups ? 'button' : undefined}
          tabIndex={hasGroups ? 0 : undefined}
          aria-expanded={hasGroups ? isExpanded : undefined}
          aria-label={hasGroups ? t('accessibility.toggleCourseGroups', { courseName: course.name }) : undefined}
          onKeyDown={(e) => {
            if (hasGroups && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              onToggleExpansion()
            }
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {hasGroups && (
              <span className={`${tokens.icon.sm} p-0 shrink-0 flex items-center justify-center transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} aria-hidden="true">
                <ChevronDown className={`${tokens.icon.xs} text-muted-foreground`} />
              </span>
            )}
            <div className={`${tokens.icon.sm} shrink-0 rounded-full`} style={{ backgroundColor: course.color }} aria-hidden="true" />
            <span
              className={`truncate max-w-full text-[13px] leading-tight ${!course.isActive ? 'line-through' : ''}`}
            >
              {course.name}
            </span>
          </div>

          <div
            className="flex items-center shrink-0"
            onClick={(e) => e.stopPropagation()}
            role="group"
            aria-label={t('accessibility.courseActions', { courseName: course.name })}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={course.isActive ? t('accessibility.hideCourse', { courseName: course.name }) : t('accessibility.showCourse', { courseName: course.name })}
                  aria-pressed={course.isActive}
                  className={`${tokens.interactive.sm} hover:bg-accent cursor-pointer`}
                  onClick={onToggleCourseVisibility}
                >
                  {course.isActive ? (
                    <Eye className={`${tokens.icon.sm} text-icon-muted`} aria-hidden="true" />
                  ) : (
                    <EyeOff className={`${tokens.icon.sm} text-icon-muted`} aria-hidden="true" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {course.isActive ? t('visibility.excludeCourse') : t('visibility.includeCourse')}
              </TooltipContent>
            </Tooltip>
            <CourseForm existingCourse={course} />
            <DeleteConfirmationDialog
              itemName={course.name}
              onConfirm={onDeleteCourse}
              title={t('confirmations.deleteCourse.title')}
              description={t('confirmations.deleteCourse.description', { itemName: course.name })}
              triggerClassName={`${tokens.interactive.sm} hover:bg-accent cursor-pointer`}
            />
          </div>
        </div>

        {isExpanded && hasGroups && (
          <div
            className="ml-4 pl-3 border-l-2 border-border mt-1 space-y-0.5 animate-fade-in"
            role="list"
            aria-label={t('accessibility.groupsOf', { courseName: course.name })}
          >
            {course.groups.map((group) => (
              <GroupListItem
                key={group.name}
                group={group}
                courseName={course.name}
                onToggleVisibility={() => onToggleGroupVisibility(group.name)}
              />
            ))}
          </div>
        )}
      </SidebarMenuItem>
    )
  }
)

// ============================================================================
// CourseList - Main component that renders the list of courses
// ============================================================================

const CourseList = memo(() => {
  const courses = useCourseStore((state) => state.courses)
  const deleteCourse = useCourseStore((state) => state.deleteCourse)
  const toggleCourseVisibility = useCourseStore((state) => state.toggleCourseVisibility)
  const toggleGroupVisibility = useCourseStore((state) => state.toggleGroupVisibility)
  const clearScheduleData = useScheduleStore((state) => state.clearScheduleData)
  const { t } = useI18n('courses')
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())

  const toggleCourseExpansion = useCallback((courseName: string) => {
    setExpandedCourses((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(courseName)) {
        newSet.delete(courseName)
      } else {
        newSet.add(courseName)
      }
      return newSet
    })
  }, [])

  const handleDeleteCourse = useCallback(
    (courseName: string) => {
      deleteCourse(courseName)
      // Clear schedules when deleting the last course
      if (courses.length === 1) {
        clearScheduleData()
      }
    },
    [courses.length, deleteCourse, clearScheduleData]
  )

  if (courses.length === 0) {
    return (
      <div className="px-4 py-4 text-center group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-muted-foreground">{t('noCoursesYet')}</p>
      </div>
    )
  }

  return (
    <SidebarMenu>
      <AnimatePresence initial={false}>
        {courses.map((course) => (
          <motion.div
            key={course.name}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <CourseListItem
              course={course}
              isExpanded={expandedCourses.has(course.name)}
              onToggleExpansion={() => toggleCourseExpansion(course.name)}
              onToggleCourseVisibility={() => toggleCourseVisibility(course.name)}
              onToggleGroupVisibility={(groupName) => toggleGroupVisibility(course.name, groupName)}
              onDeleteCourse={() => handleDeleteCourse(course.name)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </SidebarMenu>
  )
})

export default CourseList
