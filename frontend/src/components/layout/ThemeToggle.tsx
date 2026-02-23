import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Theme } from '@/types'
import { useTheme } from './ThemeProvider'
import { useI18n } from '@/hooks/useI18n'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

const ThemeToggle = () => {
  const { t } = useI18n()
  const { setTheme } = useTheme()
  const dropdownStyles =
    'bg-card border-border cursor-pointer'
  const menuItemStyles =
    'hover:bg-interactive-hover focus:bg-interactive-hover cursor-pointer'

  const themes: { name: string; value: Theme }[] = [
    { name: `${t('theme.light')}`, value: 'light' },
    { name: t('theme.dark'), value: 'dark' },
    { name: t('theme.system'), value: 'system' },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-card border-border hover:bg-interactive-hover transition-colors duration-100 cursor-pointer"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={`${dropdownStyles} rounded-md shadow-lg`}>
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
