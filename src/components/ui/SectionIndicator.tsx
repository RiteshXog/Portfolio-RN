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

const DOT_GAP = 28
const TRACK_HEIGHT = (sections.length - 1) * DOT_GAP

export default function SectionIndicator() {
  const [_activeSection, setActiveSection] = useState('home')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()

    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const viewportMid = window.scrollY + window.innerHeight / 2

      for (let i = 0; i < sections.length; i++) {
        const id = sections[i].id
        const el = document.getElementById(id)

        if (!el) continue

        const sectionTop = el.offsetTop
        const sectionBottom = sectionTop + el.offsetHeight

        if (viewportMid >= sectionTop && viewportMid < sectionBottom) {
          setActiveSection(id)

          if (i === sections.length - 1) {
            setScrollProgress(1)
          } else {
            const pct =
              (viewportMid - sectionTop) / el.offsetHeight

            const dotPos = Math.min(
              (i + pct) * DOT_GAP,
              TRACK_HEIGHT
            )

            setScrollProgress(dotPos / TRACK_HEIGHT)
          }

          return
        }
      }

      const firstEl = document.getElementById(sections[0].id)
      const lastEl = document.getElementById(
        sections[sections.length - 1].id
      )

      if (firstEl && viewportMid < firstEl.offsetTop) {
        setActiveSection(sections[0].id)
        setScrollProgress(0)
      } else if (
        lastEl &&
        viewportMid >= lastEl.offsetTop + lastEl.offsetHeight
      ) {
        setActiveSection(sections[sections.length - 1].id)
        setScrollProgress(1)
      }
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  if (isMobile) return null

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden md:block"
      aria-label="Section navigation"
    >
      <div className="relative flex flex-col items-center">
        <div
          className="relative flex flex-col items-center w-6"
          style={{
            height: TRACK_HEIGHT,
          }}
        >
          {/* Background Track */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/10"
            style={{
              width: '1px',
              height: TRACK_HEIGHT,
              zIndex: 0,
            }}
          />

          {/* Active Progress Line */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#e63c2f]"
            style={{
              width: '1px',
              height: `${scrollProgress * TRACK_HEIGHT}px`,
              zIndex: 1,
            }}
          />

          {/* Moving Red Dot */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#e63c2f] rounded-full"
            style={{
              top: `${scrollProgress * TRACK_HEIGHT}px`,
              width: 10,
              height: 10,
              zIndex: 3,
              boxShadow:
                '0 0 8px #e63c2f, 0 0 16px rgba(230, 60, 47, 0.4)',
            }}
          >
            {/* Pulse Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-[#e63c2f]"
              animate={{
                scale: [1, 2.5],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          </div>

          {/* Static Dots */}
          <ul
            className="relative flex flex-col items-center list-none m-0 p-0"
            style={{
              gap: DOT_GAP - 24,
              zIndex: 2,
            }}
          >
            {sections.map(({ id, label }) => {
              const isHovered = hoveredSection === id

              return (
                <li
                  key={id}
                  className="relative flex items-center justify-center w-6 h-6"
                >
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-10 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[10px] font-mono text-white/70 tracking-widest uppercase pointer-events-none"
                      >
                        {label}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => handleClick(id)}
                    onMouseEnter={() =>
                      setHoveredSection(id)
                    }
                    onMouseLeave={() =>
                      setHoveredSection(null)
                    }
                    className="relative flex items-center justify-center w-full h-full outline-none group"
                    aria-label={`Scroll to ${label}`}
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        width: 4,
                        height: 4,
                        backgroundColor:
                          'rgba(255,255,255,0.2)',
                      }}
                      whileHover={{
                        scale: 1.5,
                        backgroundColor:
                          'rgba(255,255,255,0.6)',
                      }}
                      transition={{
                        duration: 0.2,
                      }}
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