import { useState, useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface ScrollVelocityReturn {
  skewValue: number
}

export function useScrollVelocity(): ScrollVelocityReturn {
  const shouldReduceMotion = useReducedMotion() ?? false
  const [skewValue, setSkewValue] = useState(0)
  const lastScrollY = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (shouldReduceMotion) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY.current
      lastScrollY.current = currentScrollY

      // Map delta to skew (-2 to 2 degrees)
      const mappedSkew = Math.max(-2, Math.min(2, delta * 0.1))
      setSkewValue(mappedSkew)
    }

    // Reset after scroll stops
    const resetSkew = () => {
      setSkewValue(0)
    }

    let scrollTimeout: ReturnType<typeof setTimeout>

    const throttledScroll = () => {
      handleScroll()
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(resetSkew, 150)
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledScroll)
      clearTimeout(scrollTimeout)
      cancelAnimationFrame(rafRef.current)
    }
  }, [shouldReduceMotion])

  return { skewValue }
}