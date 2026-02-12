import { ReactNode } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

interface ResponsiveFormWrapperProps {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

/**
 * Wrapper component that renders Dialog or Drawer layout based on screen size.
 * - Mobile: Uses Drawer components (DrawerHeader, DrawerFooter)
 * - Desktop: Uses Dialog components (DialogHeader, DialogFooter)
 *
 * Usage:
 * ```tsx
 * <ResponsiveFormWrapper
 *   title="Form Title"
 *   description="Form description"
 *   footer={<Button>Submit</Button>}
 * >
 *   <form>...</form>
 * </ResponsiveFormWrapper>
 * ```
 */
export function ResponsiveFormWrapper({
  title,
  description,
  children,
  footer,
}: ResponsiveFormWrapperProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <>
        <DrawerHeader>
          <DrawerTitle className="text-lg">{title}</DrawerTitle>
          <DrawerDescription className="text-sm">{description}</DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter>{footer}</DrawerFooter>
      </>
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg">{title}</DialogTitle>
        <DialogDescription className="text-sm">{description}</DialogDescription>
      </DialogHeader>
      {children}
      <DialogFooter>{footer}</DialogFooter>
    </>
  )
}

