import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useScrollDirection, useScrollY } from '../hooks/useScrollDirection'
import { fadeUp, stagger } from '../lib/motion'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)
  const scrollDirection = useScrollDirection()
  const scrollY = useScrollY()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isMobile, setIsMobile] = useState(false)
  const shouldReduceMotion = useReducedMotion() ?? false

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Dynamic transparency based on scroll
  const opacity = Math.min(scrollY / 100, 0.92)
  const showBorder = scrollY > 50

  // Hide on scroll down, show on scroll up
  const translateY = scrollDirection === 'down' && scrollY > 100 ? '-100%' : '0%'

  useEffect(() => {
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

    navItems.forEach(({ href }) => {
      const element = document.querySelector(href)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: translateY, opacity: 1 }}
        transition={shouldReduceMotion || isMobile ? { duration: 0.2 } : { type: 'spring', stiffness: 100, damping: 20 }}
        style={{
          background: `rgba(10, 10, 10, ${opacity})`,
          backdropFilter: scrollY > 20 && !isMobile ? 'blur(20px)' : 'none',
          borderBottom: showBorder ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-2 rounded"
            aria-label="Ritesh Naik - Home"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-crimson" aria-hidden="true" />
            <span className="font-display text-base tracking-[0.1em] text-cream">RN</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8" role="list">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="font-body text-[11px] uppercase tracking-[0.15em] text-muted hover:text-cream rounded transition-colors relative"
                role="listitem"
              >
                {item.label}
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-[-2px] left-0 right-0 h-[1.5px] bg-crimson"
                    transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 min-w-[44px] min-h-[44px] items-center justify-center rounded"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span className={`block w-5 h-[1.5px] bg-crimson transition-transform ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} aria-hidden="true" />
            <span className={`block w-5 h-[1.5px] bg-crimson transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} aria-hidden="true" />
            <span className={`block w-5 h-[1.5px] bg-crimson transition-transform ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 md:hidden"
            style={{ background: 'rgba(10, 10, 10, 0.98)', backdropFilter: isMobile ? 'none' : 'blur(10px)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              variants={shouldReduceMotion || isMobile ? {} : stagger}
              initial="hidden"
              animate="visible"
            >
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="font-display text-2xl text-muted hover:text-crimson px-4 py-2 transition-colors block"
                  variants={shouldReduceMotion || isMobile ? {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.2 } }
                  } : fadeUp}
                >
                  {item.label}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
