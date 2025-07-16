import { Info, User, Mail } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'

export function InfoButton() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <button className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent rounded-md transition-colors cursor-pointer'>
              <Info className='h-4 w-4' />
            </button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('info.tooltip')}</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            {t('info.title')}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4 relative'>
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <User className='h-4 w-4 text-muted-foreground' />
              <h3 className='font-medium text-foreground'>
                {t('info.developedBy')}
              </h3>
            </div>

            <div className='space-y-3'>
              <div className='border rounded-lg p-3 bg-card'>
                <p className='font-medium text-foreground'>Gabriel González</p>
                <p className='text-xs text-muted-foreground mb-2'>
                  {t('info.university')}
                </p>
                <div className='flex items-center gap-2'>
                  <Mail className='h-3 w-3 text-muted-foreground' />
                  <p className='text-sm text-muted-foreground'>
                    gabriel@gabrielgonzalez.me
                  </p>
                </div>
              </div>

              <div className='border rounded-lg p-3 bg-card'>
                <p className='font-medium text-foreground'>Geancarlo Rivera</p>
                <p className='text-xs text-muted-foreground mb-2'>
                  {t('info.university')}
                </p>
                <div className='flex items-center gap-2'>
                  <Mail className='h-3 w-3 text-muted-foreground' />
                  <p className='text-sm text-muted-foreground'>
                    geancarlorivera831@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='border rounded-lg p-4 bg-muted/20'>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {t('info.issue')}
              <br />
              {t('info.feedback')}
            </p>
          </div>

          <div className='absolute bottom-0 right-0 text-xs text-muted-foreground/30'>
            © 2025 HorariU
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
