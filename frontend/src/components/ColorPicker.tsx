import React, { useState } from 'react'
import { FormItem, FormLabel } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { COLORS } from '@/utils/constants'
import { TailwindColor } from '@/types'

interface ColorPickerProps {
  onColorChange?: (color: string) => void
  colorValue: string
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onColorChange,
  colorValue,
}) => {
  const [open, setOpen] = useState(false)

  const selectedColor =
    COLORS.find((color) => color.value === colorValue) || COLORS[4]

  const handleSelectColor = (color: TailwindColor) => {
    if (onColorChange) {
      onColorChange(color.value)
    }
    setOpen(false)
  }

  return (
    <FormItem>
      <FormLabel>Color</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='w-full justify-start text-left font-normal h-10 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800'
          >
            <div className='flex items-center gap-2'>
              <div
                className={cn(
                  'h-5 w-5 rounded-full border',
                  selectedColor.class
                )}
              />
              <span>{selectedColor.name}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-64 p-3'>
          <div className='grid grid-cols-5 gap-2'>
            {COLORS.map((color) => (
              <button
                key={color.name}
                type='button'
                className='relative flex items-center justify-center p-1'
                onClick={() => handleSelectColor(color)}
              >
                <div
                  className={cn(
                    'h-8 w-8 rounded-full',
                    color.class,
                    'cursor-pointer flex items-center justify-center'
                  )}
                >
                  {selectedColor.name === color.name && (
                    <Check className='h-4 w-4 text-white' />
                  )}
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </FormItem>
  )
}

export default ColorPicker
