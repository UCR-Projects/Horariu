import { ReactNode } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ResponsiveTooltipProps {
  children: ReactNode
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

/**
 * Tooltip that only renders on desktop.
 * On mobile, renders only the trigger children without any tooltip wrapper.
 */
export function ResponsiveTooltip({ children, content, side }: ResponsiveTooltipProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <>{children}</>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  )
}
