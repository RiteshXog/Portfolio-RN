import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Section {
  id: string
  label: string
}

const sections: Section[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

const DOT_GAP = 28 // Gap between dots in pixels
const TRACK_HEIGHT = (sections.length - 1) * DOT_GAP

export default function SectionIndicator() {
  const [_activeSection, setActiveSection] = useState('home')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Live scroll progress and active section detection
  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate live scroll progress (0 to 1)
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = window.scrollY / totalHeight
      setScrollProgress(Math.min(1, Math.max(0, progress)))

      // 2. Detect active section (using scroll position approach)
      const sectionIds = sections.map(s => s.id)
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (element) {
          const top = element.offsetTop
          const bottom = top + element.offsetHeight
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (isMobile) return null

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden md:block"
      aria-label="Section navigation"
    >
      <div className="relative flex flex-col items-center">
        {/* Track Container */}
        <div className="relative flex flex-col items-center" style={{ height: TRACK_HEIGHT }}>
          
          {/* Background Track Line (Full Height) */}
          <div 
            className="absolute top-0 w-[1px] bg-white/10" 
            style={{ height: TRACK_HEIGHT, zIndex: 0 }}
          />

          {/* Foreground Progress Line (Live Fill) */}
          <motion.div
            className="absolute top-0 w-[1px] bg-[#e63c2f] origin-top"
            initial={false}
            animate={{ height: `${scrollProgress * 100}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
            style={{ zIndex: 1 }}
          />

          {/* Moving Active Indicator Dot */}
          <motion.div
            className="absolute w-[10px] h-[10px] bg-[#e63c2f] rounded-full"
            initial={false}
            animate={{ y: scrollProgress * TRACK_HEIGHT }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ 
              zIndex: 3, 
              left: '50%', 
              x: '-50%', 
              boxShadow: '0 0 8px #e63c2f, 0 0 16px rgba(230, 60, 47, 0.4)' 
            }}
          >
            {/* Pulse Ring for Moving Dot */}
            <motion.div
              className="absolute inset-0 rounded-full border border-[#e63c2f]"
              animate={{ scale: [1, 2.5], opacity: [1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </motion.div>

          {/* Milestone Dots (Fixed) */}
          <ul className="relative flex flex-col items-center" style={{ gap: DOT_GAP - 24, zIndex: 2 }}>
            {sections.map(({ id, label }) => {
              const isHovered = hoveredSection === id

              return (
                <li key={id} className="relative flex items-center justify-center w-6 h-6">
                  {/* Tooltip Label */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-10 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded
                          text-[10px] font-mono text-white/70 tracking-widest uppercase pointer-events-none"
                      >
                        {label}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => handleClick(id)}
                    onMouseEnter={() => setHoveredSection(id)}
                    onMouseLeave={() => setHoveredSection(null)}
                    className="relative flex items-center justify-center w-full h-full outline-none group"
                    aria-label={`Scroll to ${label}`}
                  >
                    {/* Fixed Dot Marker */}
                    <motion.div
                      initial={false}
                      animate={{
                        width: 4,
                        height: 4,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      }}
                      whileHover={{ 
                        scale: 1.5, 
                        backgroundColor: 'rgba(255,255,255,0.6)',
                        width: 4, // Keep size consistent on hover, just scale
                        height: 4 
                      }}
                      transition={{ duration: 0.2 }}
                      className="rounded-full relative z-10"
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}
