import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function FloatingShapes() {
  const shouldReduceMotion = useReducedMotion() ?? false
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (shouldReduceMotion || isMobile) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        zIndex: 0,
      }}
    >
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #b74b4b 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Cube Wireframe */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 40,
          height: 40,
          border: '1px solid #b74b4b',
          opacity: 0.15,
          willChange: 'transform',
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Diamond */}
      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: 30,
          height: 30,
          border: '1px solid #b74b4b',
          opacity: 0.12,
          transform: 'rotate(45deg)',
          willChange: 'transform',
        }}
        animate={{
          rotate: [45, -315],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Orbiting Dots */}
      <motion.div
        style={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          width: 60,
          height: 60,
          willChange: 'transform',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const radius = 25
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 3,
                height: 3,
                borderRadius: '50%',
                backgroundColor: '#b74b4b',
                opacity: 0.2,
                transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`,
              }}
            />
          )
        })}
      </motion.div>

      {/* Additional accent shapes */}
      <motion.div
        style={{
          position: 'absolute',
          top: '30%',
          right: '25%',
          width: 20,
          height: 20,
          border: '1px solid #b74b4b',
          opacity: 0.1,
          borderRadius: '50%',
          willChange: 'transform',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '20%',
          width: 15,
          height: 15,
          border: '1px solid #b74b4b',
          opacity: 0.08,
          willChange: 'transform',
        }}
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}