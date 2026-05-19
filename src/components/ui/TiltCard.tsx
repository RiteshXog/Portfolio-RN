import { useRef, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
}

export default function TiltCard({ children, className, intensity = 1 }: TiltCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  // Motion values for rotation
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  // Motion values for shine position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const shineOpacity = useMotionValue(0)

  // Spring configuration for smooth motion
  const springConfig = { stiffness: 150, damping: 20 }
  const xSpring = useSpring(rotateX, springConfig)
  const ySpring = useSpring(rotateY, springConfig)

  // Shine follow effect
  const shineX = useSpring(mouseX, springConfig)
  const shineY = useSpring(mouseY, springConfig)
  const shineAlpha = useSpring(shineOpacity, springConfig)

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile || shouldReduceMotion) return

    const rect = containerRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Calculate relative mouse position (from -0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / width - 0.5
    const relativeY = (e.clientY - rect.top) / height - 0.5

    // Map to rotation degrees (max 15 degrees * intensity)
    rotateY.set(relativeX * 30 * intensity)
    rotateX.set(-relativeY * 30 * intensity)

    // Update shine position (absolute coordinates within card)
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
    shineOpacity.set(1)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    shineOpacity.set(0)
  }

  // If mobile or reduced motion, just render children
  if (isMobile || shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        position: 'relative',
        rotateX: xSpring,
        rotateY: ySpring,
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(230, 60, 47, 0.1)',
      }}
    >
      {/* Shine Overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: useTransform(
            [shineX, shineY, shineAlpha],
            ([x, y]) => `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.08) 0%, transparent 60%)`,
          ),
          opacity: shineAlpha,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
      
      {/* Content wrapper with transform-style to ensure nesting works with 3D */}
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  )
}
