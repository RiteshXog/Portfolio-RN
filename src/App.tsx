import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LoadingScreen from './components/ui/LoadingScreen'
import Marquee from './components/ui/Marquee'
import StatsCounter from './components/ui/StatsCounter'
import Nav from './sections/Nav'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Services from './sections/Services'
import CTABanner from './sections/CTABanner'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoadingComplete(true)
  }

  return (
    <div className="relative min-h-screen">
      {/* Loading screen - shows on first load */}
      <AnimatePresence mode="wait">
        {!isLoadingComplete && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {/* Page content - fades in after loading completes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoadingComplete ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ position: 'relative' }}
      >
        {/* Atmospheric background */}
        <AtmosphericBackground />

        {/* Custom cursor - hidden on touch devices */}
        <CustomCursor />

        {/* Navigation - staggered reveal after content starts */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoadingComplete ? 1 : 0, y: isLoadingComplete ? 0 : -20 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        >
          <Nav />
        </motion.div>

        {/* Section indicators - fixed right side dots */}
        <SectionIndicator />

        {/* Page content */}
        <main className="relative" style={{ zIndex: 1 }}>
          <Hero />
          <Marquee />
          <About />
          <StatsCounter />
          <Services />
          <Projects />
          <CTABanner />
          <Contact />
          <Footer />
        </main>

        {/* Back to top button */}
        <BackToTop />

        {/* Konami code easter egg */}
        <EasterEgg />
      </motion.div>
    </div>
  )
}