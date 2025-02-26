import { useState, useEffect, useRef } from 'react'
import { TailwindColor } from '../types'
import { COLORS } from '../utils/constants'

interface ColorSelectorProps {
  currentColor?: string
  setCurrentColor: (color: string) => void
}

const ColorSelector = ({
  currentColor = COLORS[0].value,
  setCurrentColor,
}: ColorSelectorProps) => {
  const [isOpened, setIsOpened] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpened(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleColorSelect = (color: TailwindColor) => {
    setCurrentColor(color.value)
    setIsOpened(false)
  }

  const currentColorObj =
    COLORS.find((color) => color.value === currentColor) || COLORS[0]

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        className='bg-zinc-800 hover:bg-zinc-700 py-1 rounded-md flex items-center justify-center w-full gap-x-4'
        onClick={() => setIsOpened(!isOpened)}
      >
        <span>Color</span>
        <div
          className={`w-6 h-6 rounded-full shadow-md ${currentColor || currentColorObj.class}`}
        />
      </button>

      {isOpened && (
        <div className='absolute top-full left-0 mt-1 w-64 bg-zinc-900 rounded-md shadow-lg z-10'>
          <div className='p-2'>
            <div className='grid grid-cols-4 gap-4 p-2'>
              {COLORS.map((color) => (
                <div
                  key={color.name}
                  className='flex flex-col items-center'
                  onClick={() => handleColorSelect(color)}
                >
                  <div
                    className={`w-12 h-12 rounded-full cursor-pointer shadow-sm transition-all duration-200 ease-in-out ${color.class} ${
                      currentColor === color.value
                        ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-800'
                        : 'border border-zinc-700 hover:border-white'
                    }`}
                    title={color.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default ColorSelector
