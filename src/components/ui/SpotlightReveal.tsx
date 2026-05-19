import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface SpotlightRevealProps {
  children: React.ReactNode
  className?: string
}

export default function SpotlightReveal({ children, className = '' }: SpotlightRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion() ?? false
  const [isMobile, setIsMobile] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (shouldReduceMotion || isMobile) return

    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePos({ x, y })
    }

    const handleMouseLeave = () => {
      setMousePos({ x: 50, y: 50 })
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [shouldReduceMotion, isMobile])

  if (shouldReduceMotion || isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`,
      } as React.CSSProperties}
    >
      {/* Layer 1: Grayscale bottom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'grayscale(100%) blur(2px)',
          opacity: 0.4,
          zIndex: 1,
        }}
      >
        {children}
      </div>

      {/* Layer 2: Full color with mask */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          maskImage: `radial-gradient(circle 180px at var(--mouse-x) var(--mouse-y), black 0%, black 40%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 180px at var(--mouse-x) var(--mouse-y), black 0%, black 40%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}