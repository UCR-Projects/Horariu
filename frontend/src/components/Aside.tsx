import { Button } from '@/components/ui/button'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import Panel from './Panel'

interface AsideProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

const Aside = ({ isSidebarOpen, setIsSidebarOpen }: AsideProps) => {
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <aside className='layout-aside bg-neutral-300/50 dark:bg-neutral-900'>
      <div className='mini-sidebar'>
        <Button
          variant='ghost'
          size='icon'
          onClick={toggleSidebar}
          className='mb-6 hover:bg-neutral-300 dark:hover:bg-neutral-800'
          aria-label='Expand sidebar'
        >
          {isSidebarOpen ? (
            <PanelLeftClose className='h-5 w-5' />
          ) : (
            <PanelLeftOpen className='h-5 w-5' />
          )}
        </Button>
      </div>

      <div className='full-sidebar p-2'>
        <div className='flex justify-end mb-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleSidebar}
            aria-label='Collapse sidebar'
            className='hover:bg-neutral-300 dark:hover:bg-neutral-800'
          >
            <PanelLeftClose className='h-5 w-5' />
          </Button>
        </div>
        <h1 className='text-5xl font-bold text-center p-2'>HorariU</h1>
        <Panel />
      </div>
    </aside>
  )
}

export default Aside
