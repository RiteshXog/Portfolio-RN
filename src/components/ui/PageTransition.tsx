import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const shouldReduceMotion = useReducedMotion() ?? false

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')

      if (
        anchor &&
        anchor.getAttribute('href')?.startsWith('#') &&
        !anchor.hasAttribute('data-no-transition')
      ) {
        setIsTransitioning(true)
        setTimeout(() => setIsTransitioning(false), 400)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (shouldReduceMotion) {
    return <>{children}</>
  }

  return (
    <>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#b74b4b',
              zIndex: 99999,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
      {children}
    </>
  )
}