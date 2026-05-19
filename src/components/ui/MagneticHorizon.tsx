import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useMousePosition } from '../../hooks/useMousePosition'

interface MagneticHorizonProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export default function MagneticHorizon({
  children,
  className = '',
  strength = 0.4,
}: MagneticHorizonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { x: mouseX, y: mouseY } = useMousePosition()
  const shouldReduceMotion = useReducedMotion() ?? false
  const [isTouch, setIsTouch] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

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
    if (shouldReduceMotion || isTouch || isMobile) {
      x.set(0)
      y.set(0)
      return
    }

    const element = ref.current
    if (!element) return

    const handleAnimation = () => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distance = Math.sqrt(
        Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
      )

      const maxDistance = 50
      const maxMove = 20

      if (distance < maxDistance) {
        const factor = (1 - distance / maxDistance) * strength
        const moveX = (mouseX - centerX) * factor
        const moveY = (mouseY - centerY) * factor

        x.set(Math.max(Math.min(moveX, maxMove), -maxMove))
        y.set(Math.max(Math.min(moveY, maxMove), -maxMove))
      } else {
        x.set(0)
        y.set(0)
      }
    }

    const rafId = requestAnimationFrame(handleAnimation)
    return () => cancelAnimationFrame(rafId)
  }, [mouseX, mouseY, shouldReduceMotion, isTouch, isMobile, strength, x, y])

  if (shouldReduceMotion || isTouch || isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, willChange: 'transform' }}
    >
      {children}
    </motion.div>
  )
}