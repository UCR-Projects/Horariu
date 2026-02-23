import CourseForm from './courseForm/CourseForm'
import { Button } from '@/components/ui/button'
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'
import { useState, useCallback, memo } from 'react'
import useCourseStore from '@/stores/useCourseStore'
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
      className={`flex items-center justify-between px-3 py-1 rounded-md text-sm transition-colors hover:bg-interactive-hover ${
        !group.isActive ? 'opacity-50' : ''
      }`}
      role="listitem"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="h-2 w-2 rounded-full bg-linear-to-r from-muted-foreground to-muted-foreground opacity-30" aria-hidden="true" />
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
      <Button
        variant="ghost"
        size="icon"
        aria-label={group.isActive ? t('accessibility.hideGroup', { groupName: group.name }) : t('accessibility.showGroup', { groupName: group.name })}
        aria-pressed={group.isActive}
        className={`${tokens.interactive.xs} hover:bg-interactive-hover cursor-pointer transition-colors shrink-0`}
        onClick={onToggleVisibility}
      >
        {group.isActive ? (
          <Eye className={`${tokens.icon.xs} text-icon-muted`} aria-hidden="true" />
        ) : (
          <EyeOff className={`${tokens.icon.xs} text-icon-muted`} aria-hidden="true" />
        )}
      </Button>
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
          className={`flex items-center justify-between w-full px-2 py-2 rounded-lg transition-all duration-200 hover:bg-interactive-hover border border-transparent hover:border-border ${
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
              <span className={`${tokens.icon.sm} p-0 shrink-0 flex items-center justify-center`} aria-hidden="true">
                {isExpanded ? (
                  <ChevronDown className={`${tokens.icon.xs} text-muted-foreground`} />
                ) : (
                  <ChevronRight className={`${tokens.icon.xs} text-muted-foreground`} />
                )}
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
            className="flex items-center space-x-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
            role="group"
            aria-label={t('accessibility.courseActions', { courseName: course.name })}
          >
            <Button
              variant="ghost"
              size="icon"
              aria-label={course.isActive ? t('accessibility.hideCourse', { courseName: course.name }) : t('accessibility.showCourse', { courseName: course.name })}
              aria-pressed={course.isActive}
              className={`${tokens.interactive.sm} hover:bg-interactive-hover cursor-pointer`}
              onClick={onToggleCourseVisibility}
            >
              {course.isActive ? (
                <Eye className={`${tokens.icon.sm} text-icon-muted`} aria-hidden="true" />
              ) : (
                <EyeOff className={`${tokens.icon.sm} text-icon-muted`} aria-hidden="true" />
              )}
            </Button>
            <CourseForm existingCourse={course} />
            <DeleteConfirmationDialog
              itemName={course.name}
              onConfirm={onDeleteCourse}
              title={t('confirmations.deleteCourse.title')}
              description={t('confirmations.deleteCourse.description', { itemName: course.name })}
              triggerClassName={`${tokens.interactive.sm} hover:bg-interactive-hover cursor-pointer`}
            />
          </div>
        </div>

        {isExpanded && hasGroups && (
          <div className="ml-6 mt-1 space-y-1" role="list" aria-label={t('accessibility.groupsOf', { courseName: course.name })}>
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

  if (courses.length === 0) {
    return (
      <div className="px-4 py-4 text-center group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-muted-foreground">{t('noCoursesYet')}</p>
      </div>
    )
  }

  return (
    <SidebarMenu>
      {courses.map((course) => (
        <CourseListItem
          key={course.name}
          course={course}
          isExpanded={expandedCourses.has(course.name)}
          onToggleExpansion={() => toggleCourseExpansion(course.name)}
          onToggleCourseVisibility={() => toggleCourseVisibility(course.name)}
          onToggleGroupVisibility={(groupName) => toggleGroupVisibility(course.name, groupName)}
          onDeleteCourse={() => deleteCourse(course.name)}
        />
      ))}
    </SidebarMenu>
  )
})

export default CourseList
