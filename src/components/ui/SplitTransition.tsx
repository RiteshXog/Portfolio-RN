import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface SplitTransitionProps {
  children: React.ReactNode
  onTransitionComplete?: () => void
}

const TRANSITION_DURATION = 600

const panelVariants = {
  hidden: (direction: 'up' | 'down' | 'center') => ({
    y: direction === 'up' ? '-100%' : direction === 'down' ? '100%' : 0,
    opacity: 0,
  }),
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: TRANSITION_DURATION / 1000,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: (direction: 'up' | 'down' | 'center') => ({
    y: direction === 'up' ? '-100%' : direction === 'down' ? '100%' : 0,
    opacity: 0,
    transition: {
      duration: TRANSITION_DURATION / 1000,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export default function SplitTransition({ children, onTransitionComplete }: SplitTransitionProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const targetSectionRef = useRef<string | null>(null)
  const escapePressed = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerTransition = useCallback((sectionId: string) => {
    if (isTransitioning || escapePressed.current) return

    escapePressed.current = false
    targetSectionRef.current = sectionId
    setIsTransitioning(true)
    setIsExiting(false)

    document.body.style.overflow = 'hidden'
    document.body.style.cursor = 'wait'
  }, [isTransitioning])

  const dismissTransition = useCallback(() => {
    if (!isTransitioning) return

    escapePressed.current = true
    setIsExiting(true)

    setTimeout(() => {
      setIsTransitioning(false)
      setIsExiting(false)
      targetSectionRef.current = null
      document.body.style.overflow = ''
      document.body.style.cursor = ''
    }, shouldReduceMotion ? 50 : 100)
  }, [isTransitioning, shouldReduceMotion])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTransitioning) {
        dismissTransition()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isTransitioning, dismissTransition])

  useEffect(() => {
    if (!isTransitioning || isExiting) return

    timeoutRef.current = setTimeout(() => {
      if (targetSectionRef.current) {
        const target = document.querySelector(targetSectionRef.current)
        if (target) {
          target.scrollIntoView({ behavior: 'auto' })
        }
      }

      setIsExiting(true)

      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false)
        setIsExiting(false)
        targetSectionRef.current = null
        document.body.style.overflow = ''
        document.body.style.cursor = ''
        onTransitionComplete?.()
      }, shouldReduceMotion ? 100 : TRANSITION_DURATION - 200)
    }, shouldReduceMotion ? 100 : 200)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isTransitioning, isExiting, shouldReduceMotion, onTransitionComplete])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')

      if (anchor) {
        e.preventDefault()
        const href = anchor.getAttribute('href')
        if (href) {
          triggerTransition(href)
        }
      }

      const button = target.closest('button[data-section]')
      if (button) {
        const sectionId = button.getAttribute('data-section')
        if (sectionId) {
          triggerTransition(sectionId)
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [triggerTransition])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      document.body.style.overflow = ''
      document.body.style.cursor = ''
    }
  }, [])

  if (!isTransitioning) {
    return <>{children}</>
  }

  if (shouldReduceMotion) {
    return (
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial="hidden"
            animate={isExiting ? 'exit' : 'visible'}
            exit="exit"
            variants={reducedMotionVariants}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: '#0a0a0a',
              zIndex: 99998,
            }}
          />
        )}
      </AnimatePresence>
    )
  }

  return (
    <>
      {children}

      <AnimatePresence mode="wait">
        {isTransitioning && (
          <>
            {/* Noise texture overlay */}
            <div
              style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 99997,
                opacity: 0.03,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Top panel */}
            <motion.div
              initial="hidden"
              animate={isExiting ? 'exit' : 'visible'}
              exit="exit"
              variants={panelVariants}
              custom="down"
              transition={{ delay: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '33.33vh',
                background: '#0a0a0a',
                zIndex: 99998,
                willChange: 'transform',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'rgba(230,60,47,0.5)',
                }}
              />
            </motion.div>

            {/* Middle panel */}
            <motion.div
              initial="hidden"
              animate={isExiting ? 'exit' : 'visible'}
              exit="exit"
              variants={panelVariants}
              custom="center"
              transition={{ delay: 0.04 }}
              style={{
                position: 'fixed',
                top: '33.33vh',
                left: 0,
                right: 0,
                height: '33.33vh',
                background: '#0a0a0a',
                zIndex: 99998,
                willChange: 'transform',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'rgba(230,60,47,0.5)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'rgba(230,60,47,0.5)',
                }}
              />
            </motion.div>

            {/* Bottom panel */}
            <motion.div
              initial="hidden"
              animate={isExiting ? 'exit' : 'visible'}
              exit="exit"
              variants={panelVariants}
              custom="up"
              transition={{ delay: 0.08 }}
              style={{
                position: 'fixed',
                top: '66.66vh',
                left: 0,
                right: 0,
                height: '33.34vh',
                background: '#0a0a0a',
                zIndex: 99998,
                willChange: 'transform',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'rgba(230,60,47,0.5)',
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}