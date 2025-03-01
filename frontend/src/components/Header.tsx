import ThemeToggle from '@/components/ThemeToggle'

const Header = () => {
  return (
    <>
      <div className='p-2'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold p-4'>Header</h1>
          <ThemeToggle />
        </div>
      </div>
      <hr className='border-t border-neutral-300 dark:border-neutral-700' />
    </>
  )
}

export default Header
