import { Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ResponsiveTooltip } from '@/components/shared'
import { useTableStyleStore, TableStyle } from '@/stores/useTableStyleStore'
import { useI18n } from '@/hooks/useI18n'
import { cn } from '@/lib/utils'

interface StyleOption {
  id: TableStyle
  preview: React.ReactNode
}

// Mini preview components for each style
// Using table-border which adapts to light/dark mode
const ClassicPreview = () => (
  <div className="w-12 h-8 grid grid-cols-3 grid-rows-2 border border-table-border/70">
    <div className="border border-table-border/70 bg-muted/50" />
    <div className="border border-table-border/70 bg-muted/50" />
    <div className="border border-table-border/70 bg-muted/50" />
    <div className="border border-table-border/70" />
    <div className="border border-table-border/70 bg-chart-2" />
    <div className="border border-table-border/70" />
  </div>
)

const RoundedPreview = () => (
  <div className="w-12 h-8 grid grid-cols-3 grid-rows-2 border border-table-border/30 rounded-md overflow-hidden">
    <div className="border border-table-border/20 bg-muted/50" />
    <div className="border border-table-border/20 bg-muted/50" />
    <div className="border border-table-border/20 bg-muted/50" />
    <div className="border border-table-border/20" />
    <div className="border border-table-border/20 bg-chart-2" />
    <div className="border border-table-border/20" />
  </div>
)

const FloatingPreview = () => (
  <div className="w-12 h-8 grid grid-cols-3 grid-rows-2 gap-0.5 p-0.5">
    <div className="rounded-sm bg-accent" />
    <div className="rounded-sm bg-accent" />
    <div className="rounded-sm bg-accent" />
    <div className="rounded-sm bg-muted" />
    <div className="rounded-sm bg-chart-2 shadow-sm" />
    <div className="rounded-sm bg-muted" />
  </div>
)

const MinimalPreview = () => (
  <div className="w-12 h-8 grid grid-cols-3 grid-rows-2">
    <div className="border-b-2 border-table-border/60 bg-accent/80" />
    <div className="border-b-2 border-table-border/60 bg-accent/80" />
    <div className="border-b-2 border-table-border/60 bg-accent/80" />
    <div className="border-b border-table-border/40 bg-muted/50" />
    <div className="border-b border-table-border/40 bg-chart-2" />
    <div className="border-b border-table-border/40 bg-muted/50" />
  </div>
)

const GlassPreview = () => (
  <div className="w-12 h-8 grid grid-cols-3 grid-rows-2 gap-px rounded-md overflow-hidden bg-primary/5">
    <div className="bg-primary/20" />
    <div className="bg-primary/20" />
    <div className="bg-primary/20" />
    <div className="bg-muted/60" />
    <div className="bg-chart-2" />
    <div className="bg-muted/60" />
  </div>
)

const styleOptions: StyleOption[] = [
  { id: 'classic', preview: <ClassicPreview /> },
  { id: 'rounded', preview: <RoundedPreview /> },
  { id: 'floating', preview: <FloatingPreview /> },
  { id: 'minimal', preview: <MinimalPreview /> },
  { id: 'glass', preview: <GlassPreview /> },
]

// Helper function to get label for a style
function useStyleLabel(style: TableStyle) {
  const { t } = useI18n(['schedules'])
  const labels = {
    classic: t('schedules:tableStyle.classic'),
    rounded: t('schedules:tableStyle.rounded'),
    floating: t('schedules:tableStyle.floating'),
    minimal: t('schedules:tableStyle.minimal'),
    glass: t('schedules:tableStyle.glass'),
  }
  return labels[style]
}



function StyleOptionItem({
  option,
  isSelected,
  onSelect
}: {
  option: StyleOption
  isSelected: boolean
  onSelect: () => void
}) {
  const label = useStyleLabel(option.id)

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 px-2 py-2 rounded-md transition-colors text-left cursor-pointer',
        'hover:bg-accent',
        isSelected && 'bg-accent'
      )}
    >
      <div className="flex-shrink-0">{option.preview}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm flex items-center gap-2">
          {label}
          {isSelected && (
            <span className="text-primary text-xs">✓</span>
          )}
        </div>
      </div>
    </button>
  )
}

export function TableStyleSelector() {
  const { t } = useI18n(['schedules'])
  const { tableStyle, setTableStyle } = useTableStyleStore()

  return (
    <Popover>
      <ResponsiveTooltip content={t('schedules:tableStyle.title')}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer hover:bg-interactive-hover"
            aria-label={t('schedules:tableStyle.title')}
          >
            <Settings2 size={18} aria-hidden="true" />
          </Button>
        </PopoverTrigger>
      </ResponsiveTooltip>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="mb-2 px-2 py-1">
          <h4 className="font-medium text-sm">{t('schedules:tableStyle.title')}</h4>
        </div>
        <div className="space-y-1">
          {styleOptions.map((option) => (
            <StyleOptionItem
              key={option.id}
              option={option}
              isSelected={tableStyle === option.id}
              onSelect={() => setTableStyle(option.id)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

