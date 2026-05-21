// src/App.tsx
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LoadingScreen from './components/ui/LoadingScreen'
import Marquee from './components/ui/Marquee'
import StatsCounter from './components/ui/StatsCounter'
import FloatingDock from './components/ui/FloatingDock'

// Lazy load sections
const Nav = lazy(() => import('./sections/Nav'))
const Hero = lazy(() => import('./sections/Hero'))
const About = lazy(() => import('./sections/About'))
const Projects = lazy(() => import('./sections/Projects'))
const Services = lazy(() => import('./sections/Services'))
const CTABanner = lazy(() => import('./sections/CTABanner'))
const Contact = lazy(() => import('./sections/Contact'))
const Footer = lazy(() => import('./sections/Footer'))

import AtmosphericBackground from './components/AtmosphericBackground'
import CustomCursor from './components/CustomCursor'
import SectionIndicator from './components/ui/SectionIndicator'
import BackToTop from './components/ui/BackToTop'
import EasterEgg from './components/ui/EasterEgg'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  const [, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      return mobile
    }
    
    const mobile = checkMobile()
    window.addEventListener('resize', checkMobile)

    if (!mobile) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
      })
      lenisRef.current = lenis

      lenis.on('scroll', ScrollTrigger.update)

      const updateLenis = (time: number) => {
        lenis.raf(time * 1000)
      }

      gsap.ticker.add(updateLenis)
      gsap.ticker.lagSmoothing(0)

      return () => {
        lenis.destroy()
        gsap.ticker.remove(updateLenis)
        window.removeEventListener('resize', checkMobile)
      }
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLoadingComplete = () => {
    setIsLoadingComplete(true)
  }

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {!isLoadingComplete && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoadingComplete ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ position: 'relative' }}
      >
        <AtmosphericBackground />
        <CustomCursor />

        {/* Hidden original navigation */}
        <div className="hidden pointer-events-none select-none overflow-hidden h-0">
          <Suspense fallback={null}>
            <Nav />
          </Suspense>
        </div>

        {/* Bottom Floating Dock */}
        <FloatingDock />

        <SectionIndicator />

        <main className="relative" style={{ zIndex: 1 }}>
          <Suspense fallback={<div className="h-screen bg-void" />}>
            <Hero />
            <Marquee />
            <About />
            <StatsCounter />
            <Services />
            <Projects />
            <CTABanner />
            <Contact />
            <Footer />
          </Suspense>
        </main>

        <BackToTop />
        <EasterEgg />
      </motion.div>
    </div>
  )
}