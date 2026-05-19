import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
}

export default function MouseTrail() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isTouch, setIsTouch] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const shouldReduceMotion = useReducedMotion() ?? false
  const lastSpawnRef = useRef(0)
  const idRef = useRef(0)

  useEffect(() => {
    const checkDevice = () => {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches)
      setIsMobile(window.innerWidth < 768)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  useEffect(() => {
    if (shouldReduceMotion || isTouch || isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()

      // Throttle: spawn every 50ms
      if (now - lastSpawnRef.current < 50) return

      lastSpawnRef.current = now
      idRef.current += 1

      setParticles((prev) => {
        const newParticles = [
          ...prev,
          { id: idRef.current, x: e.clientX, y: e.clientY },
        ]
        // Keep max 20 particles
        return newParticles.slice(-20)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Cleanup old particles after animation
    const cleanup = setInterval(() => {
      setParticles((prev) => {
        if (prev.length > 5) {
          return prev.slice(-15)
        }
        return prev
      })
    }, 600)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(cleanup)
    }
  }, [shouldReduceMotion, isTouch, isMobile])

  if (shouldReduceMotion || isTouch || isMobile) return null

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0.6, scale: 1, y: 0 }}
          animate={{
            opacity: 0,
            scale: 0,
            y: -20,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            left: particle.x - 2,
            top: particle.y - 2,
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: '#e63c2f',
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        />
      ))}
    </AnimatePresence>
  )
}