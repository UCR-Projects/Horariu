import React, { useState } from 'react'
import { FormItem, FormLabel } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { COLOR_PALETTE, getColorInfo } from '@/utils/colorPalette'
import { getContrastTextColor } from '@/utils/colorUtils'
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

  const colorInfo = getColorInfo(colorValue)
  const displayName = colorInfo
    ? `${t(`colors.${colorInfo.family}` as 'colors.Red')} (${t(`shades.${colorInfo.shade}` as 'shades.medium')})`
    : t('colors.Red')

  const handleSelectColor = (hex: string) => {
    if (onColorChange) {
      onColorChange(hex)
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
                className="h-5 w-5 rounded-full border"
                style={{ backgroundColor: colorValue }}
                aria-hidden="true"
              />
              <span>{displayName}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" role="listbox" aria-label={t('accessibility.selectColor')}>
          <div className="space-y-2">
            {COLOR_PALETTE.map((family) => (
              <div key={family.name} className="flex items-center gap-3">
                <span className="w-16 text-sm text-muted-foreground">
                  {t(`colors.${family.name}` as 'colors.Red')}
                </span>
                <div className="flex gap-2">
                  {family.shades.map((shade) => {
                    const isSelected = colorValue.toLowerCase() === shade.hex.toLowerCase()
                    const checkColor = getContrastTextColor(shade.hex)
                    return (
                      <button
                        key={shade.hex}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        aria-label={`${t(`colors.${family.name}` as 'colors.Red')} ${t(`shades.${shade.name}` as 'shades.medium')}`}
                        className="h-7 w-7 rounded-full border-2 border-transparent hover:border-neutral-400 dark:hover:border-neutral-500 cursor-pointer flex items-center justify-center transition-colors"
                        style={{ backgroundColor: shade.hex }}
                        onClick={() => handleSelectColor(shade.hex)}
                      >
                        {isSelected && (
                          <Check
                            className="h-4 w-4"
                            style={{ color: checkColor }}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </FormItem>
  )
}

export default ColorPicker
