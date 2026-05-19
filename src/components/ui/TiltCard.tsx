import { useRef, useState, useEffect, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
}

export default function TiltCard({ children, className = '', intensity = 1 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  const shouldReduceMotion = useReducedMotion() ?? false

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 20 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 20 })
  const springY = useSpring(y, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)
    }
    checkTouch()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || isTouch) return

    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY

    const maxRotation = 15 * intensity
    const rotateXValue = (deltaY / (rect.height / 2)) * -maxRotation
    const rotateYValue = (deltaX / (rect.width / 2)) * maxRotation

    rotateX.set(rotateXValue)
    rotateY.set(rotateYValue)

    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }

  const handleMouseEnter = () => {
    if (shouldReduceMotion || isTouch) return
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (shouldReduceMotion || isTouch) return
    setIsHovered(false)
    rotateX.set(0)
    rotateY.set(0)
    x.set(0)
    y.set(0)
  }

  const tiltDisabled = shouldReduceMotion || isTouch

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        perspective: 1000,
        position: 'relative',
      }}
    >
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          rotateX: tiltDisabled ? 0 : springRotateX,
          rotateY: tiltDisabled ? 0 : springRotateY,
          willChange: 'transform',
          position: 'relative',
        }}
      >
        {/* Glossy shine overlay */}
        {!tiltDisabled && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              background: `radial-gradient(
                800px circle at ${tiltDisabled ? 50 : springX}px ${tiltDisabled ? 50 : springY}px,
                rgba(255,255,255,0.08) 0%,
                transparent 50%
              )`,
              pointerEvents: 'none',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 300ms ease',
              zIndex: 1,
            }}
          />
        )}

        {children}

        {/* Edge glow effect */}
        <motion.div
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: 'inherit',
            boxShadow: tiltDisabled
              ? 'none'
              : isHovered
                ? '0 0 30px rgba(230,60,47,0.2)'
                : 'none',
            pointerEvents: 'none',
            transition: 'box-shadow 300ms ease',
            zIndex: -1,
          }}
        />
      </motion.div>
    </div>
  )
}