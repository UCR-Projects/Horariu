import { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface AnimatedCollapseProps {
  show: boolean
  children: ReactNode
  className?: string
}

export function AnimatedCollapse({ show, children, className = '' }: AnimatedCollapseProps) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={`overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
