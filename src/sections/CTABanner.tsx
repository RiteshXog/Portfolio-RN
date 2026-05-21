import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextReveal from '../components/ui/TextReveal'
import MagneticButton from '../components/ui/MagneticButton'

gsap.registerPlugin(ScrollTrigger)

export default function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: isMobile ? 0.2 : 0.4, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } })
      gsap.fromTo(subRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: isMobile ? 0.2 : 0.4, delay: isMobile ? 0 : 0.08, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } })
      gsap.fromTo(btnRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: isMobile ? 0.2 : 0.4, delay: isMobile ? 0 : 0.16, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-[120px] text-center" style={{ zIndex: 1 }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(183, 75, 75, 0.08) 0%, transparent 70%)' }} />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8">
        <div ref={textRef}>
          <TextReveal as="p" text="Let's work together on your" className="font-display text-cream/80" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }} />
          <TextReveal as="p" text="next project" className="font-display text-gradient-animated text-shadow-glow mt-1" style={{ fontSize: 'clamp(48px, 10vw, 140px)', lineHeight: 1 }} />
        </div>

        <TextReveal text="I'm available for projects and collaborations. Let's build something great together." className="font-mono text-base text-muted max-w-md mx-auto mt-8" delay={0.2} />

        <MagneticButton onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn-gradient pill-btn text-void font-medium mt-8">
          Start a Project
        </MagneticButton>
      </div>
    </section>
  )
}