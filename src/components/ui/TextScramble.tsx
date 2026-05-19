import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface TextScrambleProps {
  text: string
  className?: string
}

const chars = '!@#$%&*ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export default function TextScramble({ text, className = '' }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const shouldReduceMotion = useReducedMotion() ?? false

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayText(text)
      return
    }

    let frame = 0
    const iterations = 8
    const totalChars = text.length

    const timeout = setTimeout(() => {
      let currentIndex = 0

      const scrambleInterval = setInterval(() => {
        const scrambled = text.split('').map((letter, index) => {
          if (index < currentIndex) {
            return letter
          }
          if (letter === ' ') return ' '
          return chars[Math.floor(Math.random() * chars.length)]
        }).join('')

        setDisplayText(scrambled)
        frame++

        if (frame % (iterations / 2) === 0) {
          currentIndex++
        }

        if (currentIndex > totalChars) {
          clearInterval(scrambleInterval)
          setDisplayText(text)
        }
      }, 50)

      return () => clearInterval(scrambleInterval)
    }, 300)

    return () => clearTimeout(timeout)
  }, [text, shouldReduceMotion])

  return (
    <span className={className} style={{ display: 'inline-block' }}>
      {displayText}
    </span>
  )
}