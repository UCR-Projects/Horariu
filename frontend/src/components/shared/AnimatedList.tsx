import { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface AnimatedListProps {
  children: ReactNode
  maxHeight?: string
  className?: string
}

export function AnimatedList({ children, maxHeight = 'max-h-64', className = '' }: AnimatedListProps) {
  return (
    <div className={`overflow-y-auto ${maxHeight} ${className}`}>
      <AnimatePresence initial={false}>
        {children}
      </AnimatePresence>
    </div>
  )
}

interface AnimatedItemProps {
  children: ReactNode
  layoutId?: string
  className?: string
}

export function AnimatedItem({ children, layoutId, className = '' }: AnimatedItemProps) {
  return (
    <motion.div
      layout={!!layoutId}
      layoutId={layoutId}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  )
}
