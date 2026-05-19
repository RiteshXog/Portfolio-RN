import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills } from '../data/projects'
import TextReveal from '../components/ui/TextReveal'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'cubic-bezier(0.22, 1, 0.36, 1)', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } })

      gsap.fromTo(contentRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.08, ease: 'cubic-bezier(0.22, 1, 0.36, 1)', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const allSkills = [...skills.frontend, ...skills.languages.slice(0, 3), ...skills.tools.slice(0, 2)]

  return (
    <section id="about" ref={sectionRef} className="relative py-[100px]" style={{ zIndex: 1 }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Image */}
          <div ref={imageRef} className="relative">
            <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: '4/5' }}>
              <img
                src={`${import.meta.env.BASE_URL}about3.webp`}
                alt="Ritesh Naik about section imgage"
                width="400"
                height="500"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                style={{ filter: 'brightness(0.8) contrast(1.1)' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, transparent 30%, rgba(183, 75, 75, 0.2) 60%)' }} />
            </div>
          </div>

          {/* Right - Content */}
          <div ref={contentRef}>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-crimson mb-4">
              <span className="mr-2">&#8592;</span>
              About Me
            </p>

            <h2 className="font-serif text-cream font-light" style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.1 }}>
              Who Am I
            </h2>

            <div className="mt-6 space-y-4 font-mono text-lg text-muted leading-relaxed">
              <TextReveal text="I'm a BCA student at PCCOER, Pune with a passion for building web applications. I specialize in frontend development using React, and I'm comfortable working with the entire web stack." delay={0.1} />
              <TextReveal text="I enjoy turning designs into clean, performant code. When I'm not coding, you'll find me exploring new tech, contributing to open source, or sharpening my problem-solving skills." delay={0.2} />
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mt-8">
              {allSkills.map((skill) => (
                <span key={skill} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>

            {/* CV Download */}
            <a
              href={`${import.meta.env.BASE_URL}resume/Ritesh_Naik_Frontend_Engineer.pdf`}
              download
              className="inline-flex items-center gap-2 mt-8 pill-btn-outline"
              aria-label="Download Ritesh Naik's resume"
            >
              <span>Download Resume</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}