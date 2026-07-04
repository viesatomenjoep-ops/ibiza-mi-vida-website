'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

const directionMap = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { y: 0, x: 40 },
  right: { y: 0, x: -40 },
  none: { y: 0, x: 0 },
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <>
      <noscript>
        <div className={className}>{children}</div>
      </noscript>
      <motion.div
        // Reveal on mount (not on scroll-into-view). whileInView + IntersectionObserver
        // could fail to fire on client-side navigation, leaving the whole page stuck at
        // opacity:0 (a blank page). Animating on mount guarantees content is always shown.
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: Math.min(delay, 0.25), ease: [0.21, 0.47, 0.32, 0.98] }}
        className={className}
      >
        {children}
      </motion.div>
    </>
  )
}
