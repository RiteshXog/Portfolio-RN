import { useRef, useState, useEffect } from 'react'
import type { Variants } from "framer-motion";
import { motion, useInView, useReducedMotion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { Code2, Layout, Palette, PenTool, Zap, Layers } from 'lucide-react'
import TextReveal from '../components/ui/TextReveal'

const services = [
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'Well-structured, maintainable code following best practices and modern patterns.',
  },
  {
    icon: Layout,
    title: 'Responsive UI',
    description: 'Pixel-perfect layouts that work seamlessly across all devices and screen sizes.',
  },
  {
    icon: Palette,
    title: 'Modern Design',
    description: 'Clean, contemporary interfaces built with current design trends and principles.',
  },
  {
    icon: PenTool,
    title: 'Design to Code',
    description: 'Accurate translation of Figma/Adobe designs into responsive, functional code.',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimized, fast-loading websites with smooth animations and interactions.',
  },
  {
    icon: Layers,
    title: 'Component Systems',
    description: 'Reusable component architectures that scale with your project needs.',
  },
]

// --- HELPER COMPONENTS & UTILS ---

const GLITCH_CHARS = '!@#$%<>{}[]'

function GlitchText({ text, start }: { text: string; start: boolean }) {
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!start) return

    let iteration = 0
    const duration = 400
    const intervalTime = 50
    const maxIterations = duration / intervalTime

    intervalRef.current = window.setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((_, index) => {
            if (index < iteration) return text[index]
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          })
          .join('')
      )

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }

      iteration += text.length / maxIterations
    }, intervalTime)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [start, text])

  return <span>{displayText}</span>
}

function ExplodingIcon({ icon: Icon, isHovered }: { icon: any; isHovered: boolean }) {
  const dots = Array.from({ length: 6 })

  return (
    <div className="relative inline-block">
      <motion.div
        animate={isHovered ? {
          scale: [1, 1.4, 0.9, 1.1, 1],
          color: ['#e63c2f', '#ff4d4d', '#e63c2f'],
        } : { scale: 1, color: '#e63c2f' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
      </motion.div>

      <AnimatePresence>
        {isHovered && dots.map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
              x: Math.cos((i * 60 * Math.PI) / 180) * 20,
              y: Math.sin((i * 60 * Math.PI) / 180) * 20,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-crimson rounded-full"
            style={{ marginLeft: '-2px', marginTop: '-2px' }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// --- MAIN COMPONENTS ---

interface GlassCardProps {
  icon: any
  title: string
  description: string
  index: number
}

function GlassCard({ icon, title, description, index }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const isInView = useInView(cardRef, { once: true, amount: 0.3 })

  // Mouse Tracking for Parallax & Shadow
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth Springs
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  // Layer Offsets
  const layer1X = useTransform(springX, (val) => val * -0.05) // Opposite
  const layer1Y = useTransform(springY, (val) => val * -0.05)
  const layer2X = useTransform(springX, (val) => val * 0.15) // Toward
  const layer2Y = useTransform(springY, (val) => val * 0.15)
  const layer3X = useTransform(springX, (val) => val * 0.08) // Toward
  const layer3Y = useTransform(springY, (val) => val * 0.08)

  // Dynamic Shadow
  const shadowX = useTransform(springX, (val) => -val * 0.15)
  const shadowY = useTransform(springY, (val) => -val * 0.15)
  const boxShadow = useTransform(
    [shadowX, shadowY],
    ([x, y]) => `${x}px ${y}px 30px rgba(230, 60, 47, ${isHovered ? 0.2 : 0})`
  )

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || shouldReduceMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  const formattedIndex = (index + 1).toString().padStart(2, '0')

  const cardContent = (
    <div className="relative w-full h-full flex flex-col p-8 overflow-hidden rounded-xl bg-[#ffffff08] backdrop-blur-lg border border-[#ffffff10] transition-colors duration-500 hover:border-transparent">
      
      {/* Liquid Border Layer */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500"
        style={{ 
          opacity: isHovered && !isMobile && !shouldReduceMotion ? 1 : 0,
          padding: '1px'
        }}
      >
        <div 
          className="w-full h-full rounded-xl border-2 border-crimson"
          style={{ filter: 'url(#liquid-goo)' }}
        />
      </div>

      {/* Holographic Shine Layer */}
      <motion.div
        className="absolute inset-0 z-1 pointer-events-none"
        initial={{ backgroundPosition: '-200% 0' }}
        animate={isHovered ? { backgroundPosition: '200% 0' } : { backgroundPosition: '-200% 0' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.08), transparent)',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Index (Layer 1 - Background) */}
      <motion.span 
        style={{ 
          x: layer1X, 
          y: layer1Y,
          translateZ: '-10px'
        }}
        className="absolute top-6 right-8 font-mono text-4xl text-white/5 pointer-events-none will-change-transform z-2"
      >
        {formattedIndex}
      </motion.span>

      <div className="relative z-10 flex flex-col h-full" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* Icon (Layer 2) */}
        <motion.div 
          style={{ x: layer2X, y: layer2Y, translateZ: '20px' }}
          className="mb-6 will-change-transform"
        >
          <ExplodingIcon icon={icon} isHovered={isHovered} />
        </motion.div>

        {/* Text (Layer 3) */}
        <motion.div 
          style={{ x: layer3X, y: layer3Y, translateZ: '10px' }}
          className="will-change-transform flex-1 flex flex-col"
        >
          <h3 className="font-display text-2xl text-cream mb-4 tracking-wide">
            {isInView ? <GlitchText text={title} start={isInView} /> : title}
          </h3>
          <p className="font-mono text-base text-muted leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>
    </div>
  )

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '800px',
        transformStyle: 'preserve-3d',
        boxShadow: !isMobile && !shouldReduceMotion ? boxShadow : 'none',
      }}
      className="relative h-full cursor-pointer will-change-transform"
    >
      {cardContent}
    </motion.div>
  )
}

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants= {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section id="services" className="relative py-[120px] bg-void overflow-hidden" style={{ zIndex: 1 }}>
      {/* SVG Liquid Filter Definition */}
      <svg className="absolute w-0 h-0 invisible" aria-hidden="true">
        <defs>
          <filter id="liquid-goo">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise">
              <animate attributeName="baseFrequency" values="0.015;0.025;0.015" dur="4s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
          </filter>
        </defs>
      </svg>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-crimson mb-4">
            <span className="mr-2">&#8592;</span>
            What I Do
          </p>
          <TextReveal
            as="h2"
            text="Services"
            className="font-display text-cream text-shadow-glow"
            style={{ fontSize: 'clamp(44px, 6vw, 80px)' }}
          />
        </div>

        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
        >
          {services.map((service, index) => (
            <motion.div key={service.title} variants={itemVariants} className="h-full">
              <GlassCard 
                icon={service.icon} 
                title={service.title} 
                description={service.description} 
                index={index} 
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
