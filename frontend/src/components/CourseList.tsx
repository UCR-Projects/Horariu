import CourseForm from '@/components/courseForm/CourseForm'
import { Button } from '@/components/ui/button'
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'
import { useState } from 'react'
import useCourseStore from '@/stores/useCourseStore'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'

const CourseList = () => {
  const { courses, deleteCourse, toggleCourseVisibility, toggleGroupVisibility } = useCourseStore()
  const { t } = useI18n('courses')
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())

  const toggleCourseExpansion = (courseName: string) => {
    setExpandedCourses((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(courseName)) {
        newSet.delete(courseName)
      } else {
        newSet.add(courseName)
      }
      return newSet
    })
  }

  if (courses.length === 0) {
    return (
      <div className="px-4 py-4 text-center group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-neutral-500 dark:text-neutral-500">{t('noCoursesYet')}</p>
      </div>
    )
  }

  return (
    <SidebarMenu>
      {courses.map((course) => {
        const isExpanded = expandedCourses.has(course.name)
        const hasGroups = course.groups.length > 0

        return (
          <SidebarMenuItem key={course.name} className="group-data-[collapsible=icon]:hidden">
            <div
              className={`flex items-center justify-between w-full px-2 py-2 rounded-lg transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 ${
                !course.isActive ? 'opacity-50' : ''
              } ${hasGroups ? 'cursor-pointer' : ''}`}
              onClick={() => hasGroups && toggleCourseExpansion(course.name)}
            >
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                {hasGroups && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent shrink-0 cursor-pointer"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3 text-neutral-500" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-neutral-500" />
                    )}
                  </Button>
                )}
                <div className={`h-4 w-4 shrink-0 rounded-full ${course.color}`} />
                <span
                  className={`truncate max-w-full text-[13px] leading-tight ${!course.isActive ? 'line-through' : ''}`}
                >
                  {course.name}
                </span>
              </div>
              <div
                className="flex items-center space-x-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 dark:hover:bg-neutral-900/80 hover:bg-neutral-200 cursor-pointer"
                  onClick={() => toggleCourseVisibility(course.name)}
                >
                  {course.isActive ? (
                    <Eye className="h-4 w-4 text-neutral-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-neutral-600" />
                  )}
                </Button>
                <CourseForm existingCourse={course} />
                <DeleteConfirmationDialog
                  itemName={course.name}
                  onConfirm={() => deleteCourse(course.name)}
                  title={t('confirmations.deleteCourse.title')}
                  description={t('confirmations.deleteCourse.description', {
                    itemName: course.name,
                  })}
                  triggerClassName="h-7 w-7 hover:bg-neutral-200 dark:hover:bg-neutral-900/80 cursor-pointer"
                />
              </div>
            </div>

            {isExpanded && hasGroups && (
              <div className="ml-6 mt-1 space-y-1">
                {course.groups.map((group) => (
                  <div
                    key={group.name}
                    className={`flex items-center justify-between px-3 py-1 rounded-md text-sm transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
                      !group.isActive ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-2 w-2 rounded-full bg-linear-to-r from-neutral-400 to-neutral-500 opacity-30" />

                      <span
                        className={`truncate max-w-full text-xs font-normal ${!group.isActive ? 'line-through text-neutral-400' : 'text-neutral-600 dark:text-neutral-400'}`}
                      >
                        {group.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/80 cursor-pointer transition-colors shrink-0"
                      onClick={() => toggleGroupVisibility(course.name, group.name)}
                    >
                      {group.isActive ? (
                        <Eye className="h-3 w-3 text-neutral-600" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-neutral-600" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

export default CourseList
