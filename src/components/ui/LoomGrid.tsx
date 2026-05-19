import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface GridPoint {
  x: number
  y: number
  baseX: number
  baseY: number
}

export default function LoomGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldReduceMotion = useReducedMotion() ?? false
  const [isMobile, setIsMobile] = useState(false)
  const rafRef = useRef<number>(0)
  const pointsRef = useRef<GridPoint[]>([])

  const GRID_SPACING = 40

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

      // Initialize grid points
      const points: GridPoint[] = []
      for (let x = 0; x <= width; x += GRID_SPACING) {
        for (let y = 0; y <= height; y += GRID_SPACING) {
          points.push({ x, y, baseX: x, baseY: y })
        }
      }
      pointsRef.current = points
    }
    resize()

    let mouseX = -1000
    let mouseY = -1000

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const handleMouseLeave = () => {
      mouseX = -1000
      mouseY = -1000
    }
    window.addEventListener('mouseleave', handleMouseLeave)

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      const points = pointsRef.current
      const affectedRadius = 150
      const maxOffset = 40

      // Calculate new positions
      for (const point of points) {
        const dx = point.baseX - mouseX
        const dy = point.baseY - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < affectedRadius && mouseX > 0) {
          const strength = (1 - dist / affectedRadius) * maxOffset
          const angle = Math.atan2(dy, dx)
          point.x = point.baseX + Math.cos(angle) * strength
          point.y = point.baseY + Math.sin(angle) * strength
        } else {
          // Lerp back to original
          point.x += (point.baseX - point.x) * 0.12
          point.y += (point.baseY - point.y) * 0.12
        }
      }

      // Draw vertical lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
      ctx.lineWidth = 0.5
      for (let x = 0; x <= width; x += GRID_SPACING) {
        ctx.beginPath()
        for (let i = 0; i < points.length; i++) {
          const point = points.find(p => p.baseX === x && p.baseY === i * GRID_SPACING)
          if (point) {
            if (i === 0) {
              ctx.moveTo(point.x, point.y)
            } else {
              ctx.lineTo(point.x, point.y)
            }
          }
        }
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = 0; y <= height; y += GRID_SPACING) {
        ctx.beginPath()
        for (let i = 0; i <= Math.ceil(width / GRID_SPACING); i++) {
          const point = points.find(p => p.baseX === i * GRID_SPACING && p.baseY === y)
          if (point) {
            if (i === 0) {
              ctx.moveTo(point.x, point.y)
            } else {
              ctx.lineTo(point.x, point.y)
            }
          }
        }
        ctx.stroke()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
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