import { useRef, type CSSProperties } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p'
  style?: CSSProperties
}

export default function TextReveal({ text, className = '', delay = 0, as: Tag = 'p', style }: TextRevealProps) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const isInView = useInView(ref, { once: true, margin: isMobile ? '-50px' : '-100px' })
  const shouldReduceMotion = useReducedMotion()

  const words = text.split(' ')

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: isMobile ? 0 : 0.06,
        delayChildren: delay,
      },
    },
  }

  const wordVariants: Variants = {
    hidden: {
      y: isMobile ? 10 : '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: isMobile ? 0.2 : 0.6,
        ease: isMobile ? 'easeOut' : [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  }

  if (shouldReduceMotion) {
    return (
      <Tag ref={ref} className={className} style={style}>
        {text}
      </Tag>
    )
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ display: 'inline', ...style }}
    >
      {words.map((word, index) => (
        <span key={index} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <motion.span
            variants={wordVariants}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
            className={className}
          >
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.div>
  )
}