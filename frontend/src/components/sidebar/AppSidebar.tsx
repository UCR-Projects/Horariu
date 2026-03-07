import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import { useI18n } from '@/hooks/useI18n'
import { useIsMobile } from '@/hooks/use-mobile'
import { CourseList, CoursesListOptions, CourseForm } from '@/components/courses'

export function AppSidebar() {
  const { t } = useI18n('courses')
  const isMobile = useIsMobile()

  return (
    <>
      <div className={isMobile ? 'invisible sm:visible' : ''}>
        <Sidebar collapsible="icon">
          {/* Collapse trigger */}
          {!isMobile && (
            <div className="flex items-center justify-end px-1 py-2">
              <SidebarTrigger className="cursor-pointer" />
            </div>
          )}

          {/* Header with title + actions */}
          <SidebarHeader className="px-3 py-2 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                {t('coursesList')}
              </h2>
              <div className="flex items-center gap-1">
                <CoursesListOptions />
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {/* Add course button - only on mobile */}
            {isMobile && (
              <SidebarGroup className="group-data-[collapsible=icon]:hidden px-2 py-2">
                <CourseForm />
              </SidebarGroup>
            )}

            {/* Course list */}
            <SidebarGroup className="flex-1 overflow-hidden">
              <SidebarGroupContent className="overflow-y-auto">
                <CourseList />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </>
  )
}
