import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code2, Layout, Palette, PenTool, Zap, Layers } from 'lucide-react'
import TextReveal from '../components/ui/TextReveal'
import TiltCard from '../components/ui/TiltCard'

gsap.registerPlugin(ScrollTrigger)

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

function GlassCard({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { translateY: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '24px',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'border-color 300ms ease, box-shadow 300ms ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      className="glass-card"
    >
      <style>{`
        .glass-card:hover {
          border-color: rgba(230,60,47,0.3);
          box-shadow: inset 0 0 20px rgba(230,60,47,0.05);
        }
      `}</style>
      {children}
    </motion.div>
  )
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current?.children || [], { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: 'cubic-bezier(0.22, 1, 0.36, 1)', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } })
      gsap.fromTo(gridRef.current?.children || [], { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: 'cubic-bezier(0.22, 1, 0.36, 1)', scrollTrigger: { trigger: gridRef.current, start: 'top 80%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="relative py-[100px]" style={{ zIndex: 1 }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div ref={headerRef} className="mb-12">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-crimson mb-4">
            <span className="mr-2">&#8592;</span>
            What I Do
          </p>
          <TextReveal as="h2" text="Services" className="font-display text-cream text-shadow-glow" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }} />
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {services.map(({ icon: Icon, title, description }) => (
            <TiltCard key={title} className="h-full">
              <GlassCard>
                <motion.div
                  whileHover={{ translateZ: 20, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Icon size={24} className="text-crimson" strokeWidth={1.5} aria-hidden="true" />
                </motion.div>
                <h3 className="font-display text-lg text-cream mt-4 tracking-wide">{title}</h3>
                <p className="font-mono text-base text-muted mt-3 leading-relaxed flex-1">{description}</p>
              </GlassCard>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}