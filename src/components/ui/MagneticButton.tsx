import { useRef, useState, useEffect, type ReactNode } from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  ariaLabel?: string
  strength?: number
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ariaLabel,
  strength = 0.3,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [isTouch, setIsTouch] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 15 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  useEffect(() => {
    const checkDevice = () => {
      setIsTouch(window.matchMedia('(hover: none)').matches || 'ontouchstart' in window)
      setIsMobile(window.innerWidth < 768)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || disabled || isTouch || isMobile) return

    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY

    const maxMovement = 12

    const moveX = Math.min(Math.max(deltaX * strength, -maxMovement), maxMovement)
    const moveY = Math.min(Math.max(deltaY * strength, -maxMovement), maxMovement)

    x.set(moveX)
    y.set(moveY)
  }

  const handleMouseLeave = () => {
    if (shouldReduceMotion || disabled || isTouch || isMobile) return
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      className={`cursor-pointer ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: isMobile ? 0 : springX, y: isMobile ? 0 : springY }}
    >
      {children}
    </motion.button>
  )
}
