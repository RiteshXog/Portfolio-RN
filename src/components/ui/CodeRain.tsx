import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface RainCharacter {
  char: string
  x: number
  y: number
  speed: number
  length: number
}

export default function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldReduceMotion = useReducedMotion() ?? false
  const [isMobile, setIsMobile] = useState(false)
  const rafRef = useRef<number>(0)

  const chars = '<>/{};0123456789ReactTS'

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (shouldReduceMotion || isMobile) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let width = window.innerWidth
    let height = window.innerHeight

    // Only on right side of hero
    const startX = width * 0.6
    const sectionWidth = width * 0.4

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }
    resize()

    interface Drop {
      x: number
      y: number
      speed: number
      chars: RainCharacter[]
      opacity: number
    }

    const drops: Drop[] = []
    const DROP_COUNT = 15

    for (let i = 0; i < DROP_COUNT; i++) {
      const length = Math.floor(Math.random() * 8) + 5
      drops.push({
        x: startX + Math.random() * sectionWidth,
        y: Math.random() * height,
        speed: Math.random() * 1 + 2,
        chars: Array.from({ length }, () => ({
          char: chars[Math.floor(Math.random() * chars.length)],
          x: 0,
          y: 0,
          speed: Math.random() * 1 + 2,
          length: 0,
        })),
        opacity: Math.random() * 0.3 + 0.1,
      })
    }

    const animate = () => {
      // Create gradient mask
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, 'rgba(10, 10, 10, 1)')
      gradient.addColorStop(0.6, 'rgba(10, 10, 10, 1)')
      gradient.addColorStop(1, 'rgba(10, 10, 10, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      ctx.font = '10px "JetBrains Mono", monospace'

      for (const drop of drops) {
        // Update y position
        drop.y += drop.speed

        // Wrap around
        if (drop.y > height + 100) {
          drop.y = -20
          drop.x = startX + Math.random() * sectionWidth
        }

        // Draw characters
        for (let i = 0; i < drop.chars.length; i++) {
          // Randomize character
          if (Math.random() > 0.95) {
            drop.chars[i].char = chars[Math.floor(Math.random() * chars.length)]
          }

          const charY = drop.y - i * 12
          const fadeOpacity = drop.opacity * (1 - i / drop.chars.length)

          ctx.fillStyle = `rgba(230, 60, 47, ${fadeOpacity})`
          ctx.fillText(drop.chars[i].char, drop.x, charY)
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [shouldReduceMotion, isMobile])

  if (shouldReduceMotion || isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '40%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.4,
      }}
    />
  )
}