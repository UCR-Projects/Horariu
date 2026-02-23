import { Download, FileImage, FileText } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/useI18n'

interface ScheduleExportMenuProps {
  onExportImage: () => void
  onExportPDF: () => void
}

export function ScheduleExportMenu({ onExportImage, onExportPDF }: ScheduleExportMenuProps) {
  const { t } = useI18n(['schedules', 'common'])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label={t('common:accessibility.exportSchedule')}
          className="bg-card cursor-pointer hover:bg-interactive-hover"
        >
          <Download size={16} className="mr-1" aria-hidden="true" />
          <span>{t('schedules:downloadSchedule')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={onExportImage}
          className="cursor-pointer hover:bg-interactive-hover"
        >
          <FileImage size={16} className="mr-2" aria-hidden="true" />
          <span>{t('schedules:image')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onExportPDF}
          className="cursor-pointer hover:bg-interactive-hover"
        >
          <FileText size={16} className="mr-2" aria-hidden="true" />
          <span>PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

