import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Theme } from '@/types'
import { useTheme } from '@/components/ThemeProvider'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

const ThemeToggle = () => {
  const { setTheme } = useTheme()
  const dropdownStyles =
    'dark:bg-neutral-800 dark:border-neutral-900/40 border-neutral-300 bg-neutral-100'
  const menuItemStyles =
    'hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:bg-neutral-200 dark:focus:bg-neutral-700'

  const themes: { name: string; value: Theme }[] = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
    { name: 'System', value: 'system' },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700
            border-neutral-300 bg-neutral-100 hover:bg-neutral-200/50 transition-colors duration-100'
        >
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className={`${dropdownStyles} rounded-md shadow-lg`}
      >
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            className={menuItemStyles}
            onClick={() => setTheme(theme.value)}
          >
            {theme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeToggle
