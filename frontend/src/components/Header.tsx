import ThemeToggle from '@/components/ThemeToggle'

const Header = () => {
  return (
    <div className='w-full flex flex-col'>
      <div className='p-2'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold p-4'>Header</h1>
          <div className='flex items-center gap-4 mr-4'>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <hr className='border-t border-neutral-300 dark:border-neutral-700 w-full mx-0 px-0' />
    </div>
  )
}

export default Header
