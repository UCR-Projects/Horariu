import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

interface EmptyStateAction {
  label: string
  onClick: () => void
  icon?: LucideIcon
  variant?: 'default' | 'outline' | 'ghost'
}

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  primaryAction?: EmptyStateAction
  secondaryAction?: Omit<EmptyStateAction, 'icon' | 'variant'>
  children?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 animate-fade-in ${className}`}
    >
      <div className="flex flex-col items-center max-w-md text-center">
        {/* Icon container */}
        <div className="rounded-2xl bg-muted/50 p-6 mb-6">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>

        {/* Custom content (like forms) */}
        {children}

        {/* Action buttons */}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
            {primaryAction && (
              <Button
                size="lg"
                variant={primaryAction.variant || 'default'}
                onClick={primaryAction.onClick}
                className="gap-2"
              >
                {primaryAction.icon && <primaryAction.icon className="h-5 w-5" />}
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button 
                variant="ghost" 
                size="lg" 
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

