import { useI18n } from '@/hooks/useI18n'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export type ScheduleSource = 'generated' | 'saved'

interface ScheduleSourceToggleProps {
  source: ScheduleSource
  onSourceChange: (source: ScheduleSource) => void
  generatedCount: number
  savedCount: number
}

export function ScheduleSourceToggle({
  source,
  onSourceChange,
  generatedCount,
  savedCount,
}: ScheduleSourceToggleProps) {
  const { t } = useI18n('schedules')

  return (
    <Tabs value={source} onValueChange={(v) => onSourceChange(v as ScheduleSource)}>
      <TabsList variant="line">
        <TabsTrigger value="generated" className="cursor-pointer">
          {t('source.generated')}
          <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0 h-5">
            {generatedCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="saved" className="cursor-pointer">
          {t('source.saved')}
          <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0 h-5">
            {savedCount}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
