import { type Variants, type Transition } from 'framer-motion'

// Spring physics configuration
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
}

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 150,
  damping: 20,
}

// Shared animation variants
export const fadeUp: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: springTransition,
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
}

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

export const scale: Variants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: springBouncy,
  },
}

export const slideIn: Variants = {
  hidden: {
    x: -20,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: springTransition,
  },
}

// Reduced motion variants - just opacity
export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}