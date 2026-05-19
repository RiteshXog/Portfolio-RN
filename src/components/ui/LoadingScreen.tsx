import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isExiting, setIsExiting] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    // Minimum display time: 1.5 seconds
    const minimumDuration = shouldReduceMotion ? 500 : 1500
    const timeout = setTimeout(() => {
      setIsExiting(true)
    }, minimumDuration)

    return () => clearTimeout(timeout)
  }, [shouldReduceMotion])

  // Call onComplete after exit animation finishes (400ms after exit starts)
  useEffect(() => {
    if (isExiting) {
      const exitDuration = shouldReduceMotion ? 100 : 400
      const timeout = setTimeout(() => {
        onComplete()
      }, exitDuration)
      return () => clearTimeout(timeout)
    }
  }, [isExiting, onComplete, shouldReduceMotion])

  const exitDuration = shouldReduceMotion ? 0.1 : 0.4

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: exitDuration, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      {/* Logo - RN with crimson dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#b74b4b',
            boxShadow: '0 0 8px rgba(183, 75, 75, 0.6)',
          }}
          aria-hidden="true"
        />
        <span
          className="font-display"
          style={{
            fontSize: 'clamp(48px, 12vw, 80px)',
            color: '#FAFAFA',
            letterSpacing: '0.1em',
            lineHeight: 1,
          }}
        >
          RN
        </span>
      </div>

      {/* Progress bar - runs for 1.5s then stops */}
      <div style={{ width: '200px', maxWidth: '80vw' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isExiting ? 1 : undefined }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 1.5,
            ease: 'easeInOut',
          }}
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, #b74b4b, #ff8c00)',
            transformOrigin: 'left',
          }}
        />
      </div>
    </motion.div>
  )
}