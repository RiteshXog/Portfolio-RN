import { useEffect, useRef, useState } from 'react'

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export function useKonamiCode() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isUnlocked) return

      const key = e.key.toLowerCase()
      const expectedKey = KONAMI_CODE[indexRef.current].toLowerCase()

      if (key === expectedKey) {
        indexRef.current += 1
        if (indexRef.current >= KONAMI_CODE.length) {
          setIsUnlocked(true)
          indexRef.current = 0
        }
      } else {
        indexRef.current = 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isUnlocked])

  return isUnlocked
}