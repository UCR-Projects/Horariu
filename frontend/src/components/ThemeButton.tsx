import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@/assets/icons/Icons'

const ThemeButton = () => {
  const getStoredTheme = () => {
    if (typeof window === 'undefined') return 'light' // If window is not defined, return light theme

    // If there is a theme stored in localStorage, return it
    // or check if the user prefers dark mode in their OS config
    return (
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
    )
  }

  const [theme, setTheme] = useState(() => getStoredTheme()) // Initialize theme with stored theme

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme]) // Update theme in localStorage and document.documentElement when theme changes

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)') // Object to check if user prefers dark mode
    const handleChange = (e: MediaQueryListEvent) => {
      // Function to handle changes in user preference
      setTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange) // Listen for changes in user preference

    return () => mediaQuery.removeEventListener('change', handleChange) // Remove event listener when component unmounts
  }, []) // Update theme when user changes OS theme preference

  return (
    <div className='p-4'>
      <button
        className='transition-transform duration-200 hover:scale-125'
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  )
}

export default ThemeButton
