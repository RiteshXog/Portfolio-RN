import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Github, ExternalLink } from 'lucide-react'
import { projects } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'cubic-bezier(0.22, 1, 0.36, 1)', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } })

      gsap.fromTo(gridRef.current?.children || [], { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'cubic-bezier(0.22, 1, 0.36, 1)', scrollTrigger: { trigger: gridRef.current, start: 'top 80%' } })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-[100px]"
      style={{ zIndex: 1 }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-crimson mb-4">
            <span className="mr-2">&#8592;</span>
            Selected Work
          </p>
          <h2
            className="font-display text-cream text-shadow-glow"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
          >
            Projects
          </h2>
        </div>

        {/* Projects Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project) => (
            <article
              key={project.id}
              className="group relative glass-panel rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Highlight indicator */}
              {project.highlight && (
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-crimson/60 border border-crimson/20 px-2 py-1 rounded">
                    Featured
                  </span>
                </div>
              )}

              {/* Project Title */}
              <h3 className="font-display text-2xl text-cream tracking-wide group-hover:text-crimson transition-colors duration-300">
                {project.title}
              </h3>

              {/* Description */}
              <p className="font-mono text-base text-muted mt-4 leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mt-6" role="list" aria-label="Technologies used">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-base text-muted/70 px-3 py-1.5 bg-white/[0.03] rounded"
                    role="listitem"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-4 mt-8">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} source code on GitHub`}
                    className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.1em] text-muted hover:text-crimson transition-colors"
                  >
                    <Github size={16} />
                    <span>Code</span>
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View live demo of ${project.title}`}
                    className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.1em] text-muted hover:text-crimson transition-colors"
                  >
                    <ExternalLink size={16} />
                    <span>Live</span>
                  </a>
                )}
              </div>

              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-2xl border border-transparent transition-colors duration-300 group-hover:border-crimson/20 pointer-events-none" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}