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

  useEffect(() => {
    // Prevent scroll during loading
    document.body.classList.add('loading')
     
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
      gsap.ticker.remove(updateLenis)
      document.body.classList.remove('loading', 'loaded')
    }
  }, [])

  const updateLenis = (time: number) => {
    if (lenisRef.current) {
      lenisRef.current.raf(time * 1000)
    }
  }

  const handleLoadingComplete = () => {
    setIsLoadingComplete(true)
    document.body.classList.remove('loading')
    document.body.classList.add('loaded')

    // Defer Lenis initialization until after loading screen is gone
    setTimeout(() => {
      const lenis = new Lenis({
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1.2,
        touchMultiplier: 2,
        infinite: false,
        
      })
       
      lenisRef.current = lenis
      lenis.start() // Explicitly start Lenis
       
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(updateLenis)
      gsap.ticker.lagSmoothing(0)
    }, 100) // Small delay to allow browser to paint
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
        className="relative"
      >
        <AtmosphericBackground />
        <CustomCursor />

        {/* Top Navigation - visible on mobile only */}
        <div className="md:hidden">
          <Suspense fallback={null}>
            <Nav />
          </Suspense>
        </div>

        {/* Bottom Floating Dock - handles its own mobile removal */}
        <FloatingDock />

        <SectionIndicator />

        {/* Main content wrapper with natural scrolling (no h-screen or overflow-hidden) */}
        <main className="relative z-[1]">
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