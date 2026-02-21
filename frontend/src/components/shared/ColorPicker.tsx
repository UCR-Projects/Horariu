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
import { useI18n } from '@/hooks/useI18n'

interface ColorPickerProps {
  onColorChange?: (color: string) => void
  colorValue: string
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onColorChange,
  colorValue,
}) => {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  const selectedColor =
    COLORS.find((color) => color.value === colorValue) || COLORS[4]

  const getColorTranslation = (colorName: string) => {
    return t(`colors.${colorName}` as 'colors.Amber')
  }

  const handleSelectColor = (color: TailwindColor) => {
    if (onColorChange) {
      onColorChange(color.value)
    }
    setOpen(false)
  }

  return (
    <FormItem>
      <FormLabel id="color-picker-label">{t('accessibility.color')}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-labelledby="color-picker-label"
            aria-expanded={open}
            aria-haspopup="listbox"
            className="w-full justify-start text-left font-normal h-10 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'h-5 w-5 rounded-full border',
                  selectedColor.class
                )}
                aria-hidden="true"
              />
              <span>{getColorTranslation(selectedColor.name)}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" role="listbox" aria-label={t('accessibility.selectColor')}>
          <div className="grid grid-cols-5 gap-2">
            {COLORS.map((color) => {
              const isSelected = selectedColor.name === color.name
              const colorTranslation = getColorTranslation(color.name)
              return (
                <button
                  key={color.name}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-label={colorTranslation}
                  className="relative flex items-center justify-center p-1"
                  onClick={() => handleSelectColor(color)}
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full',
                      color.class,
                      'cursor-pointer flex items-center justify-center'
                    )}
                  >
                    {isSelected && (
                      <Check className="h-4 w-4 text-white" aria-hidden="true" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </FormItem>
  )
}

export default ColorPicker
