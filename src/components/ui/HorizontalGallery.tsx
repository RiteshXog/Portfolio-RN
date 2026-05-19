import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'
import type { Project } from '../../data/projects'

interface HorizontalGalleryProps {
  projects: Project[]
}

export default function HorizontalGallery({ projects }: HorizontalGalleryProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  
  // Track vertical scroll progress of this specific section
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  })

  // Calculate the horizontal translation
  // We want to move from 0 to -(total width - viewport width)
  // Since we use percentages for the items, we calculate based on project count
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(projects.length - 1) * 25}%`])

  return (
    <section 
      ref={targetRef} 
      className="relative h-[400vh] bg-transparent"
      id="projects-horizontal"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Header inside sticky container */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 w-full mb-12">
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

        {/* Horizontal Track */}
        <div className="flex items-center">
          <motion.div 
            style={{ x }} 
            className="flex gap-8 px-6 lg:px-20"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className="group relative glass-panel rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 shrink-0 w-[85vw] md:w-[45vw] lg:w-[30vw]"
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
      <p className="font-mono text-sm md:text-base text-muted mt-4 leading-relaxed line-clamp-4">
        {project.description}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mt-6" role="list" aria-label="Technologies used">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="font-mono text-[10px] md:text-xs text-muted/70 px-2 py-1 bg-white/[0.03] rounded border border-white/5"
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
  )
}
