import { useState, useEffect, type ElementType } from 'react'
import { useReducedMotion } from 'framer-motion'

interface GlitchTextProps {
  text: string
  className?: string
  as?: ElementType
}

const GLITCH_CHARS = '!@#$%^&*<>{}[]|\\/'

export default function GlitchText({ text, className = '', as: Tag = 'span' }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)
  const shouldReduceMotion = useReducedMotion() ?? false

  useEffect(() => {
    if (shouldReduceMotion) return

    const handleHover = () => {
      if (isGlitching) return

      setIsGlitching(true)

      // Scramble animation
      let iterations = 0
      const maxIterations = 6

      const scramble = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, i) => {
              if (i < iterations) return char
              if (char === ' ') return ' '
              return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            })
            .join('')
        )

        iterations++
        if (iterations >= maxIterations) {
          clearInterval(scramble)
          setDisplayText(text)
          setTimeout(() => setIsGlitching(false), 200)
        }
      }, 30)

      return () => clearInterval(scramble)
    }

    const element = document.querySelector(`.glitch-${text.replace(/\s/g, '-')}`)
    element?.addEventListener('mouseenter', handleHover)

    return () => element?.removeEventListener('mouseenter', handleHover)
  }, [text, isGlitching, shouldReduceMotion])

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag className={`glitch-${text.replace(/\s/g, '-')} ${className}`} style={{ position: 'relative' }}>
      {/* Red layer */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          color: 'rgba(255, 0, 0, 0.8)',
          mixBlendMode: 'screen',
          transform: isGlitching ? 'translateX(-3px)' : 'translateX(0)',
          transition: 'transform 300ms ease',
        }}
      >
        {displayText}
      </span>

      {/* Green layer */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          color: 'rgba(0, 255, 0, 0.8)',
          mixBlendMode: 'screen',
          transform: 'translateX(0)',
        }}
      >
        {displayText}
      </span>

      {/* Blue layer */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          color: 'rgba(0, 0, 255, 0.8)',
          mixBlendMode: 'screen',
          transform: isGlitching ? 'translateX(3px)' : 'translateX(0)',
          transition: 'transform 300ms ease',
        }}
      >
        {displayText}
      </span>

      {/* Main white text */}
      <span style={{ position: 'relative', color: '#fff' }}>{displayText}</span>
    </Tag>
  )
}