import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldReduceMotion = useReducedMotion() ?? false
  const [isMobile, setIsMobile] = useState(false)
  const rafRef = useRef<number>(0)

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

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      baseVx: number
      baseVy: number
    }

    const particles: Particle[] = []
    const PARTICLE_COUNT = 60

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.2,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.2 + 0.1,
        baseVx: (Math.random() - 0.5) * 0.3,
        baseVy: -Math.random() * 0.5 - 0.2,
      })
    }

    let mouseX = -1000
    let mouseY = -1000

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 100) {
          const force = (1 - dist / 100) * 0.5
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Lerp back to base velocity
        p.vx += (p.baseVx - p.vx) * 0.02
        p.vy += (p.baseVy - p.vy) * 0.02

        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [shouldReduceMotion, isMobile])

  if (shouldReduceMotion || isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}