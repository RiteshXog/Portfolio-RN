import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

interface Stat {
  value: number
  suffix: string
  label: string
}

const stats: Stat[] = [
  { value: 2, suffix: '+', label: 'Years Learning' },
  { value: 10, suffix: '+', label: 'Projects Built' },
  { value: 5, suffix: '+', label: 'Happy Clients' },
  { value: 100, suffix: '%', label: 'Passion for Code' },
]

// Particle burst component
function ParticleBurst({ show }: { show: boolean }) {
  if (!show) return null

  const particles = Array.from({ length: 6 })

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 80,
            y: (Math.random() - 0.5) * 80,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 3,
            height: 3,
            borderRadius: '50%',
            backgroundColor: '#b74b4b',
          }}
        />
      ))}
    </div>
  )
}

function AnimatedNumber({
  value,
  suffix,
  inView,
  reducedMotion,
  onComplete,
}: {
  value: number
  suffix: string
  inView: boolean
  reducedMotion: boolean
  onComplete?: () => void
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const [showGlitch, setShowGlitch] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const hasTriggeredComplete = useRef(false)

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(value)
      return
    }

    if (!inView) return

    let startTime: number
    const duration = 2000

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.floor(eased * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Count finished - trigger glitch and particles
        if (!hasTriggeredComplete.current) {
          hasTriggeredComplete.current = true
          setShowGlitch(true)
          setShowParticles(true)
          setTimeout(() => setShowGlitch(false), 200)
          setTimeout(() => setShowParticles(false), 600)
          onComplete?.()
        }
      }
    }

    requestAnimationFrame(animate)
  }, [inView, value, reducedMotion, onComplete])

  const glitchClass = showGlitch ? 'glitch-effect' : ''

  return (
    <span style={{ position: 'relative' }}>
      <span className={glitchClass}>
        {displayValue}
      </span>
      <span style={{ color: '#b74b4b' }}>{suffix}</span>
      <ParticleBurst show={showParticles} />
    </span>
  )
}

export default function StatsCounter() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <section
      ref={sectionRef}
      className="relative py-16"
      style={{ backgroundColor: '#0A0A0A', zIndex: 1 }}
    >
      <style>{`
        @keyframes glitch-shift {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); filter: blur(0.5px); }
          60% { transform: translate(-1px, 2px); }
          80% { transform: translate(1px, -2px); filter: blur(0); }
          100% { transform: translate(0); }
        }
        .glitch-effect {
          animation: glitch-shift 200ms ease-out;
          text-shadow: -2px 0 #00ffff, 2px 0 #ff0000;
        }
        .stat-label:hover .underline-animate {
          width: 100%;
        }
        .underline-animate {
          width: 0;
          transition: width 300ms ease;
        }
        .stat-card:hover .stat-number {
          text-shadow: 0 0 20px rgba(230,60,47,0.6);
        }
        .stat-card:hover .stat-glow {
          opacity: 0.07;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              whileHover={{ backgroundColor: 'rgba(230,60,47,0.04)' }}
              transition={{
                duration: 0.6,
                delay: shouldReduceMotion ? 0 : index * 0.2,
                ease: 'easeOut',
              }}
              className="stat-card"
              style={{
                padding: '32px 24px',
                ...(index < 3 ? { borderRight: '1px solid rgba(255,255,255,0.1)' } : {}),
                borderTop: '2px solid #b74b4b',
                textAlign: 'center',
                position: 'relative',
                transition: 'background-color 300ms ease',
              }}
            >
              {/* Background glow - depth effect */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 200,
                  height: 100,
                  background: 'radial-gradient(ellipse, rgba(183,75,75,0.03) 0%, transparent 70%)',
                  pointerEvents: 'none',
                  transition: 'opacity 300ms ease',
                }}
                className="stat-glow"
              />

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  color: '#fff',
                  fontSize: 'clamp(48px, 8vw, 96px)',
                  lineHeight: 1,
                  position: 'relative',
                  textShadow: '0 0 20px rgba(230,60,47,0)',
                  transition: 'text-shadow 300ms ease',
                }}
                className="stat-number"
              >
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={isInView}
                  reducedMotion={shouldReduceMotion}
                />
              </motion.div>

              <div
                className="stat-label"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  marginTop: 8,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  color: '#9ca3af',
                }}
              >
                {stat.label}
                <div
                  className="underline-animate"
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    height: 1,
                    backgroundColor: '#b74b4b',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}