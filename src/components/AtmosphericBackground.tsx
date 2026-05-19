import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function AtmosphericBackground() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 })
  const shouldReduceMotion = useReducedMotion() ?? false

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    let rafId: number

    const animate = () => {
      setSpotlightPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.02,
        y: prev.y + (mousePos.y - prev.y) * 0.02,
      }))
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [mousePos])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Animated SVG noise with slow drift */}
      {!shouldReduceMotion && (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04, mixBlendMode: 'screen' }}>
          <filter id="animated-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            >
              <animate
                attributeName="baseFrequency"
                values="0.65;0.75;0.65"
                dur="8s"
                repeatCount="indefinite"
              />
            </feTurbulence>
          </filter>
          <rect width="100%" height="100%" filter="url(#animated-noise)" />
        </svg>
      )}

      {shouldReduceMotion && (
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Breathing Orb 1 - Hero top right */}
      {!shouldReduceMotion && (
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(230, 60, 47, 0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Breathing Orb 2 - About bottom left */}
      {!shouldReduceMotion && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 107, 53, 0.04) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.02, 0.06, 0.02],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      )}

      {/* Breathing Orb 3 - Services center */}
      {!shouldReduceMotion && (
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(230, 60, 47, 0.03) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      )}

      {/* Static blooms */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, rgba(183, 75, 75, 0.8) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, rgba(255, 140, 0, 0.6) 0%, transparent 70%)' }}
      />

      {/* Mouse-reactive glow */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.03] transition-transform duration-500 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(183, 75, 75, 0.5) 0%, transparent 60%)',
          transform: `translate(${mousePos.x * 8 - 200}px, ${mousePos.y * 8 - 200}px)`,
        }}
      />

      {!shouldReduceMotion && (
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] transition-transform [transition-duration:2000ms] ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(183, 75, 75, 0.04) 0%, transparent 70%)',
            transform: `translate(${spotlightPos.x * 10 - 300}px, ${spotlightPos.y * 10 - 300}px)`,
            left: 0,
            top: 0,
          }}
        />
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10, 10, 10, 0.3) 100%)',
        }}
      />
    </div>
  )
}