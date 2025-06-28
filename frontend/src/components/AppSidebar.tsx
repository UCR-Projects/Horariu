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
import { ClearCoursesButton } from './ClearCoursesButton'

export function AppSidebar() {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  return (
    <>
      {isMobile && (
        <div className='absolute top-2 left-2 z-10'>
          <SidebarTrigger className='cursor-pointer' />
        </div>
      )}

      <div className={isMobile ? 'invisible sm:visible' : ''}>
        <Sidebar collapsible='icon'>
          {!isMobile && (
            <div className='flex items-center justify-end p-2 align-middle'>
              <SidebarTrigger className='cursor-pointer' />
            </div>
          )}

          <SidebarHeader className='text-xl font-bold px-4 py-2 group-data-[collapsible=icon]:hidden'>
            {t('course')}s
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
              <SidebarGroupContent className='px-4'>
                <CourseForm />
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className='flex-1 overflow-hidden'>
              <div className='flex items-center justify-between px-4 group-data-[collapsible=icon]:hidden pb-2.5'>
                <SidebarGroupLabel className='text-md font-medium text-neutral-800 dark:text-neutral-400 flex-1'>
                  {t('coursesList')}
                </SidebarGroupLabel>
                <ClearCoursesButton />
              </div>
              <SidebarGroupContent className='overflow-y-auto'>
                <CourseList />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className='p-2'>
            <LanguageToggleButton />
          </SidebarFooter>
        </Sidebar>
      </div>
    </>
  )
}
