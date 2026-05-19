import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

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

export default function SectionIndicator() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMobile, setIsMobile] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile || shouldReduceMotion) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [isMobile, shouldReduceMotion])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (isMobile || shouldReduceMotion) return null

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden md:block"
      aria-label="Section navigation"
    >
      <ul className="flex flex-col gap-4">
        {sections.map(({ id, label }) => {
          const isActive = activeSection === id
          return (
            <li key={id} className="relative group">
              {/* Tooltip */}
              <span
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                style={{ backgroundColor: '#1a1a1a' }}
              >
                {label}
              </span>

              <button
                onClick={() => handleClick(id)}
                aria-label={`Go to ${label}`}
                className="flex items-center justify-center w-4 h-4 rounded-full transition-all duration-300"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.6 : 1,
                    backgroundColor: isActive ? '#b74b4b' : 'rgba(255,255,255,0.2)',
                    boxShadow: isActive
                      ? '0 0 12px rgba(183, 75, 75, 0.6)'
                      : 'none',
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: isActive ? 8 : 5,
                    height: isActive ? 8 : 5,
                    borderRadius: '50%',
                  }}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}