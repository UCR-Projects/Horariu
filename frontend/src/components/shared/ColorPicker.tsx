import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { FormItem, FormLabel } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, Plus, X } from 'lucide-react'
import { COLOR_PALETTE, getColorInfo } from '@/utils/colorPalette'
import { getContrastTextColor } from '@/utils/colorUtils'
import { useI18n } from '@/hooks/useI18n'
import useCustomColorStore from '@/stores/useCustomColorStore'

const MAX_CUSTOM_COLORS = 5

interface ColorPickerProps {
  onColorChange?: (color: string) => void
  colorValue: string
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onColorChange,
  colorValue,
}) => {
  const [open, setOpen] = useState(false)
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [pendingColor, setPendingColor] = useState('#6366f1')
  const { t } = useI18n()

  const { customColors, addColor, removeColor } = useCustomColorStore()

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

  const handleAddCustomColor = () => {
    addColor(pendingColor)
    setShowCustomPicker(false)
  }

  const handleRemoveCustomColor = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeColor(hex)
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

            {/* Custom Colors Row */}
            <div className="flex items-center gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <span className="w-16 text-sm text-muted-foreground">
                {t('colors.Custom')}
              </span>
              <div className="flex gap-2 items-center">
                {customColors.map((hex) => {
                  const isSelected = colorValue.toLowerCase() === hex.toLowerCase()
                  const checkColor = getContrastTextColor(hex)
                  return (
                    <div key={hex} className="relative group">
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        aria-label={`${t('colors.Custom')} ${hex}`}
                        className="h-7 w-7 rounded-full border-2 border-transparent hover:border-neutral-400 dark:hover:border-neutral-500 cursor-pointer flex items-center justify-center transition-colors"
                        style={{ backgroundColor: hex }}
                        onClick={() => handleSelectColor(hex)}
                      >
                        {isSelected && (
                          <Check
                            className="h-4 w-4"
                            style={{ color: checkColor }}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                      <button
                        type="button"
                        aria-label={t('customColors.remove')}
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer hover:scale-110"
                        onClick={(e) => handleRemoveCustomColor(hex, e)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })}

                {/* Add custom color button */}
                {customColors.length < MAX_CUSTOM_COLORS && (
                  <Popover open={showCustomPicker} onOpenChange={setShowCustomPicker}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        aria-label={t('customColors.add')}
                        className="h-7 w-7 rounded-full border-2 border-dashed border-neutral-400 dark:border-neutral-500 hover:border-neutral-600 dark:hover:border-neutral-300 cursor-pointer flex items-center justify-center transition-colors"
                      >
                        <Plus className="h-4 w-4 text-neutral-500" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" side="right" align="start">
                      <div className="flex flex-col gap-3">
                        <span className="text-sm font-medium">{t('customColors.pickColor')}</span>
                        <HexColorPicker color={pendingColor} onChange={setPendingColor} />
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 w-6 rounded border"
                            style={{ backgroundColor: pendingColor }}
                          />
                          <span className="text-sm font-mono">{pendingColor}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setShowCustomPicker(false)}
                          >
                            {t('customColors.cancel')}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleAddCustomColor}
                          >
                            {t('customColors.save')}
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </FormItem>
  )
}

export default ColorPicker
