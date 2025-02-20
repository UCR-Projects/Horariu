import ThemeButton from './ThemeButton'

const Header = () => {
  return (
    <div className='flex justify-between items-center'>
      <h1 className='text-2xl font-bold p-4'>Header</h1>
      <ThemeButton />
    </div>
  )
}

export default Header
