import { Button } from './ui/button'
import { useSidebar } from './ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { BookOpen } from 'lucide-react'

export const MobileSidebarTrigger = () => {
  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <div className='pb-2'>
      <Button
        variant='outline'
        onClick={toggleSidebar}
        className='w-full md:w-auto px-4 py-2 font-medium disabled:text-neutral-400 disabled:bg-neutral-900 cursor-pointer'
      >
        <BookOpen className='h-4 w-4 mr-2' />
        See Courses
      </Button>
    </div>
  )
}
