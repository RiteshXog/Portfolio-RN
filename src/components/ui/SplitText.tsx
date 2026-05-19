import { useRef, type ElementType } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  tag?: ElementType
}

export default function SplitText({ text, className = '', tag: Tag = 'span' }: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const shouldReduceMotion = useReducedMotion() ?? false

  const characters = text.split('')

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  }

  const charVariants: Variants = {
    hidden: {
      y: '110%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  if (shouldReduceMotion || isInView === false) {
    return <Tag ref={ref} className={className}>{text}</Tag>
  }

  return (
    <Tag ref={ref} className={className} style={{ display: 'inline-flex' }}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'inherit' }}
      >
        {characters.map((char, index) => (
          <span
            key={index}
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'bottom',
            }}
          >
            <motion.span
              variants={charVariants}
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? ' ' : char}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}