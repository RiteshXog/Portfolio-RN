import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

type CursorState = 'default' | 'link' | 'image' | 'text' | 'project' | 'click'

export default function CustomCursor() {
  const innerRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [cursorState, setCursorState] = useState<CursorState>('default')
  const [isClicked, setIsClicked] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const innerSpring = useSpring(cursorX, { stiffness: 200, damping: 28 })
  const innerSpringY = useSpring(cursorY, { stiffness: 200, damping: 28 })
  const outerSpring = useSpring(cursorX, { stiffness: 200, damping: 28 })
  const outerSpringY = useSpring(cursorY, { stiffness: 200, damping: 28 })

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(window.matchMedia('(hover: none)').matches || 'ontouchstart' in window)
    }
    checkTouch()

    if (isTouch || shouldReduceMotion) return

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (target.closest('[data-cursor="project"]')) {
        setCursorState('project')
      } else if (target.closest('img') || target.closest('[data-cursor="image"]')) {
        setCursorState('image')
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('contenteditable')) {
        setCursorState('text')
      } else if (target.closest('a') || target.closest('button') || target.closest('[data-cursor="link"]')) {
        setCursorState('link')
      } else {
        setCursorState('default')
      }
    }

    const onMouseDown = () => setIsClicked(true)
    const onMouseUp = () => setIsClicked(false)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseover', onMouseOver)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseover', onMouseOver)
    }
  }, [isTouch, shouldReduceMotion, cursorX, cursorY])

  if (isTouch || shouldReduceMotion) return null

  const isLink = cursorState === 'link'
  const isImage = cursorState === 'image'
  const isText = cursorState === 'text'
  const isProject = cursorState === 'project'

  return (
    <>
      {/* Inner dot */}
      <motion.div
        ref={innerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#fff',
          pointerEvents: 'none',
          zIndex: 10000,
          x: innerSpring,
          y: innerSpringY,
          translateX: -4,
          translateY: -4,
          opacity: isLink || isProject ? 0 : 1,
          scale: isClicked ? 0.8 : 1,
        }}
      />

      {/* Outer ring */}
      <motion.div
        ref={outerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: `2px solid #b74b4b`,
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          zIndex: 9999,
          x: outerSpring,
          y: outerSpringY,
          translateX: -16,
          translateY: -16,
          scale: isClicked ? 0.9 : 1,
        }}
        animate={{
          width: isText ? 48 : isLink ? 64 : isProject ? 80 : 32,
          height: isText ? 24 : isLink ? 64 : isProject ? 80 : 32,
          borderRadius: isText ? '2px' : '50%',
          backgroundColor: isProject ? '#e63c2f' : isLink ? 'rgba(183, 75, 75, 0.2)' : 'transparent',
          translateX: isText ? -24 : isLink ? -32 : isProject ? -40 : -16,
          translateY: isText ? -12 : isLink ? -32 : isProject ? -40 : -16,
          borderWidth: isProject ? 0 : 2,
        }}
        transition={{ stiffness: 200, damping: 28 }}
      />

      {/* "VIEW PROJECT" Project Viewer State */}
      {isProject && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 80,
            height: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 10001,
            x: cursorX,
            y: cursorY,
            translateX: -40,
            translateY: -40,
          }}
        >
          <span style={{ color: '#fff', fontSize: '9px', fontFamily: 'JetBrains Mono', fontWeight: 600, letterSpacing: '0.1em' }}>
            VIEW
          </span>
          <span style={{ color: '#fff', fontSize: '9px', fontFamily: 'JetBrains Mono', fontWeight: 600, letterSpacing: '0.1em' }}>
            PROJECT
          </span>
        </motion.div>
      )}

      {/* "VIEW" label on image hover */}
      {isImage && (
        <motion.div
          ref={labelRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            padding: '8px 16px',
            backgroundColor: '#0A0A0A',
            borderRadius: '20px',
            border: '1px solid rgba(183, 75, 75, 0.5)',
            pointerEvents: 'none',
            zIndex: 10001,
            x: cursorX,
            y: cursorY,
            translateX: -40,
            translateY: -16,
          }}
        >
          <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            VIEW
          </span>
        </motion.div>
      )}
    </>
  )
}