import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'

interface HeroRevealProps {
  children: React.ReactNode
}

const PHASE_KEY = 'heroRevealComplete'

export default function HeroReveal({ children }: HeroRevealProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const escapePressed = useRef(false)
  const triggeredRef = useRef(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 0.9, 0.75])
  const y = useTransform(scrollYProgress, [0, 0.15, 0.3], [0, -30, -60])
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [0, 0.3, 0.6])
  const contentRevealOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1])

  const springConfig = { stiffness: 150, damping: 20 }
  const animatedScale = useSpring(scale, springConfig)
  const animatedY = useSpring(y, springConfig)
  const animatedVignette = useSpring(vignetteOpacity, springConfig)
  const animatedContentReveal = useSpring(contentRevealOpacity, springConfig)

  useEffect(() => {
    const checkSession = () => {
      try {
        const hasTriggered = sessionStorage.getItem(PHASE_KEY)
        if (hasTriggered) {
          setIsComplete(true)
        }
      } catch {
        setIsComplete(false)
      }
    }
    checkSession()
  }, [])

  useEffect(() => {
    if (isComplete) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !escapePressed.current) {
        escapePressed.current = true
        setIsComplete(true)
        try {
          sessionStorage.setItem(PHASE_KEY, 'true')
        } catch {}
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isComplete])

  useEffect(() => {
    if (isComplete || triggeredRef.current) return

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest > 0.25 && !triggeredRef.current && !escapePressed.current) {
        triggeredRef.current = true
        setIsComplete(true)
        setShowHint(false)
        try {
          sessionStorage.setItem(PHASE_KEY, 'true')
        } catch {}
      }

      if (latest > 0.02 && showHint) {
        setShowHint(false)
      }
    })

    return () => unsubscribe()
  }, [scrollYProgress, isComplete, showHint])

  if (isComplete) {
    return <>{children}</>
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Hero with additive transforms - ALWAYS VISIBLE */}
      <motion.div
        style={{
          scale: animatedScale,
          y: animatedY,
        }}
      >
        {children}
      </motion.div>

      {/* Additive vignette overlay */}
      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)',
          opacity: animatedVignette,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Content reveal from below - additive */}
      <motion.div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200vh',
          top: '100%',
          background: 'linear-gradient(to top, rgba(230,60,47,0.12) 0%, transparent 60%)',
          opacity: animatedContentReveal,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Hint - fades on scroll */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: '8%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: 'rgba(255,255,255,0.5)',
              textAlign: 'center',
              zIndex: 20,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Scroll to explore
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}