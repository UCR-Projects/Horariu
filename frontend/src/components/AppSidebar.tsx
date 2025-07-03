import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar'

import { useTranslation } from 'react-i18next'
import CourseList from '@/components/CourseList'
import CourseForm from './courseForm/CourseForm'
import { LanguageToggleButton } from '@/components/LanguageToggle'
import { useIsMobile } from '@/hooks/use-mobile'
import { CoursesListOptions } from './CoursesListOptions'

export function AppSidebar() {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  return (
    <>
      <div className={isMobile ? 'invisible sm:visible' : ''}>
        <Sidebar collapsible='icon'>
          {!isMobile && (
            <div className='flex items-center justify-end px-4 py-2'>
              <SidebarTrigger className='cursor-pointer' />
            </div>
          )}

          <SidebarHeader className='text-xl font-bold px-5 py-2 group-data-[collapsible=icon]:hidden'>
            {t('course')}s
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
              <SidebarGroupContent className='px-4'>
                <CourseForm />
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className='flex-1 overflow-hidden'>
              <SidebarGroupLabel className='flex items-center justify-between px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-400 group-data-[collapsible=icon]:hidden'>
                <span>{t('coursesList')}</span>
                <CoursesListOptions />
              </SidebarGroupLabel>

              <SidebarGroupContent className='overflow-y-auto px-1.5 py-3'>
                <CourseList />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className='px-4 py-2 group-data-[collapsible=icon]:hidden'>
            <LanguageToggleButton />
          </SidebarFooter>
        </Sidebar>
      </div>
    </>
  )
}
