import { useEffect, useState, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface TypewriterProps {
  className?: string
}

const PHRASES = [
  'Frontend Developer',
  'React Specialist',
  'UI Engineer',
  'Clean Code Advocate',
  'Open To Work',
]

export default function Typewriter({ className = '' }: TypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [charIndex, setCharIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const shouldReduceMotion = useReducedMotion() ?? false

  const currentPhrase = PHRASES[phraseIndex]

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayText(currentPhrase)
      return
    }

    const typeChar = () => {
      if (isTyping) {
        // Typing
        if (charIndex < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, charIndex + 1))
          setCharIndex((prev) => prev + 1)
        } else {
          // Pause after typing complete
          setTimeout(() => setIsTyping(false), 2000)
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setDisplayText(currentPhrase.slice(0, charIndex - 1))
          setCharIndex((prev) => prev - 1)
        } else {
          // Move to next phrase
          setPhraseIndex((prev) => (prev + 1) % PHRASES.length)
          setIsTyping(true)
          setTimeout(() => {}, 500)
        }
      }
    }

    const charTime = isTyping ? 80 : 40

    intervalRef.current = setInterval(typeChar, charTime)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [charIndex, isTyping, phraseIndex, currentPhrase, shouldReduceMotion])

  if (shouldReduceMotion) {
    return (
      <span className={className}>
        {currentPhrase}
        <span className="inline-block w-[2px] h-[1em] bg-crimson ml-1 align-middle" />
      </span>
    )
  }

  return (
    <span className={className}>
      {displayText}
      <span
        className="inline-block w-[2px] h-[1em] bg-crimson ml-1 align-middle"
        style={{
          animation: 'typewriter-blink 1s steps(2, start) infinite',
        }}
      />
      <style>{`
        @keyframes typewriter-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}