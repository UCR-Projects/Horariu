import { Download, FileImage, FileText } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('common:accessibility.exportSchedule')}
              className="cursor-pointer hover:bg-interactive-hover"
            >
              <Download size={18} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('schedules:downloadSchedule')}</TooltipContent>
      </Tooltip>
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

