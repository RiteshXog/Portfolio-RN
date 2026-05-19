import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
}

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

const TITLE_TEXT = 'SECRET UNLOCKED'
const SUBTITLE = 'You clearly have good taste.'
const STATS = [
  { value: '10+', label: 'Projects' },
  { value: '∞', label: 'Passion' },
  { value: '1', label: 'Easter Egg' },
]

function ParticleFloat({ particle }: { particle: Particle }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
        x: [0, Math.random() * 40 - 20, 0],
        y: [0, Math.random() * 40 - 20, 0],
      }}
      transition={{
        duration: particle.duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        left: particle.x,
        top: particle.y,
        width: particle.size,
        height: particle.size,
        borderRadius: '50%',
        background: 'rgba(230, 60, 47, 0.6)',
        boxShadow: '0 0 10px rgba(230, 60, 47, 0.8)',
        pointerEvents: 'none',
      }}
    />
  )
}

function LetterAnimation({
  letter,
  delay,
}: {
  letter: string
  delay: number
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: delay * 0.04 + 0.3,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ display: 'inline-block' }}
    >
      {letter}
    </motion.span>
  )
}

export default function EasterEgg() {
  const [isVisible, setIsVisible] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 2 + 2,
    }))
  )
  const indexRef = useRef(0)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const dismiss = () => {
    setIsVisible(false)
    setCountdown(5)
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }

  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === KONAMI_CODE[indexRef.current].toLowerCase()) {
        indexRef.current += 1
        if (indexRef.current >= KONAMI_CODE.length) {
          indexRef.current = 0
        }
      } else {
        indexRef.current = 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  useEffect(() => {
    const checkKonami = () => {
      let index = 0
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === KONAMI_CODE[index].toLowerCase()) {
          index++
          if (index >= KONAMI_CODE.length) {
            setIsVisible(true)
            index = 0
          }
        } else {
          index = 0
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }

    const cleanup = checkKonami()
    return cleanup
  }, [])

  useEffect(() => {
    if (!isVisible) return

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          dismiss()
          return 5
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    document.body.style.overflow = 'hidden'

    // Screen shake and flash (skip for reduced motion)
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isReducedMotion) {
      // Flash
      const flash = document.createElement('div')
      flash.style.cssText = `
        position: fixed;
        inset: 0;
        background: white;
        z-index: 99998;
        pointer-events: none;
        animation: flash 100ms ease-out forwards;
      `
      document.body.appendChild(flash)
      setTimeout(() => flash.remove(), 100)

      // Shake
      document.body.style.animation = 'shake 300ms ease-out'
      setTimeout(() => {
        document.body.style.animation = ''
      }, 300)
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.animation = ''
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Screen effects keyframes */}
          <style>{`
            @keyframes flash {
              0% { opacity: 0.8; }
              100% { opacity: 0; }
            }
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20% { transform: translateX(-8px); }
              40% { transform: translateX(8px); }
              60% { transform: translateX(-8px); }
              80% { transform: translateX(8px); }
            }
            @keyframes underline {
              0% { width: 0; }
              100% { width: 100%; }
            }
          `}</style>

          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 99990,
              cursor: 'pointer',
            }}
          />

          {/* Main popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateX: 45, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.5, rotateX: 45, x: '-50%', y: '-50%' }}
            transition={{
              duration: 0.6,
              stiffness: 200,
              damping: 20,
            }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(480px, 90vw)',
              zIndex: 99999,
              cursor: 'default',
            }}
          >
            {/* Background glass */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(230, 60, 47, 0.3)',
                borderRadius: '16px',
                boxShadow: `
                  0 0 0 1px rgba(230, 60, 47, 0.1),
                  0 0 80px rgba(230, 60, 47, 0.2),
                  0 0 160px rgba(230, 60, 47, 0.1)
                `,
                padding: '48px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Floating particles */}
              {particles.map((p) => (
                <ParticleFloat key={p.id} particle={p} />
              ))}

              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '20px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: 'white',
                }}
              >
                {countdown.toString().padStart(2, '0')}
              </motion.div>

              {/* Glitch icon */}
              <motion.div
                animate={{
                  x: [0, -2, 2, -1, 1, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                style={{
                  fontSize: '64px',
                  color: '#e63c2f',
                  textAlign: 'center',
                  textShadow: '0 0 30px #e63c2f',
                  marginBottom: '24px',
                  fontFamily: 'monospace',
                }}
              >
                💀
              </motion.div>

              {/* Title */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '20px',
                }}
              >
                <h2
                  style={{
                    fontSize: '48px',
                    fontWeight: 400,
                    color: 'white',
                    letterSpacing: '0.1em',
                    fontFamily: "'Bebas Neue', sans-serif",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {TITLE_TEXT.split('').map((letter, i) => (
                    <LetterAnimation key={i} letter={letter} delay={i} />
                  ))}
                </h2>
              </div>

              {/* Glitch line */}
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, #e63c2f, transparent)',
                  margin: '0 auto 20px',
                  maxWidth: '200px',
                }}
              />

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.9 }}
                style={{
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '14px',
                    color: 'white',
                  }}
                >
                  {SUBTITLE}
                </span>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0',
                  marginBottom: '32px',
                }}
              >
                {STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0 20px',
                      borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '18px',
                        color: '#e63c2f',
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.4)',
                        marginTop: '4px',
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                onClick={dismiss}
                style={{
                  display: 'block',
                  margin: '0 auto',
                  background: 'none',
                  border: 'none',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '14px',
                  color: '#e63c2f',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '4px 0',
                }}
                onMouseEnter={(e) => {
                  const span = e.currentTarget.querySelector('span')
                  if (span) {
                    span.style.width = '100%'
                  }
                }}
                onMouseLeave={(e) => {
                  const span = e.currentTarget.querySelector('span')
                  if (span) {
                    span.style.width = '0%'
                  }
                }}
              >
                [ CLOSE ]
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '1px',
                    background: '#e63c2f',
                    width: '0%',
                    transition: 'width 200ms ease',
                  }}
                />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}