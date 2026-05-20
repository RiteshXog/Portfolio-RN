import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { projects } from "../data/projects";
type Project = (typeof projects)[number];

// --- HELPER COMPONENTS ---

function TerminalPreview({
  tech,
  isVisible,
}: {
  tech: string[];
  isVisible: boolean;
}) {
  const [typedLines, setTypedLines] = useState<string[]>([]);

  useEffect(() => {
    if (!isVisible) {
      setTypedLines([]);
      return;
    }

    let currentLine = 0;
    const lines = tech.map(
      (t) => `> install ${t.toLowerCase().replace(/\s+/g, "-")}`,
    );

    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setTypedLines((prev) => [...prev, lines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible, tech]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-60 bg-[#0A0A0A] border border-crimson/30 rounded-lg shadow-2xl z-50 overflow-hidden pointer-events-none"
        >
          <div className="flex items-center gap-1.5 px-3 py-2 bg-crimson/10 border-b border-crimson/20">
            <div className="w-2 h-2 rounded-full bg-crimson/40" />
            <div className="w-2 h-2 rounded-full bg-crimson/20" />
            <div className="w-2 h-2 rounded-full bg-crimson/10" />
            <span className="ml-2 font-mono text-[9px] text-crimson/60 uppercase tracking-widest">
              Stack.sh
            </span>
          </div>
          <div className="p-3 font-mono text-[10px] leading-relaxed">
            {typedLines.map((line: string, i: number) => (
              <div key={i} className="flex gap-2 mb-1">
                <span className="text-crimson">$</span>
                <span className="text-white/80">{line}</span>
              </div>
            ))}
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-1.5 h-3 bg-crimson/60 align-middle ml-1"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RGBDistortionImage({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl opacity-20 pointer-events-none">
      {/* Background fill */}
      <div className="absolute inset-0 bg-void" />

      {/* Red Layer */}
      <motion.div
        animate={isHovered ? { x: -3, opacity: 0.5 } : { x: 0, opacity: 0 }}
        className="absolute inset-0 bg-crimson mix-blend-screen"
        style={{ filter: "url(#displacement-warp)" }}
      />

      {/* Blue Layer */}
      <motion.div
        animate={isHovered ? { x: 3, opacity: 0.5 } : { x: 0, opacity: 0 }}
        className="absolute inset-0 bg-[#0000ff] mix-blend-screen"
        style={{ filter: "url(#displacement-warp)" }}
      />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(230,60,47,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(230,60,47,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
    </div>
  );
}


function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  // --- MAGNETIC PULL ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const pullX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const pullY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  // --- HOLOGRAPHIC & SHINE ---
  const rotateAngle = useTransform(mouseX, [-200, 200], [0, 360]);
  const holoGradient = useTransform(
    rotateAngle,
    (angle) =>
      `linear-gradient(${angle}deg, hsla(${angle}, 70%, 50%, 0.05) 0%, transparent 100%)`,
  );
  const shineX = useSpring(useTransform(mouseX, [-200, 200], [-100, 100]), {
    stiffness: 100,
    damping: 20,
  });
  const shineY = useSpring(useTransform(mouseY, [-200, 200], [-100, 100]), {
    stiffness: 100,
    damping: 20,
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || shouldReduceMotion || !cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Magnetic pull activation within 150px
    if (distance < 150) {
      mouseX.set(dx * 0.1); // Max 15px pull
      mouseY.set(dy * 0.1);
    } else {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleFlip = (e: React.MouseEvent) => {
    // Prevent flip if clicking links
    if ((e.target as HTMLElement).closest("a")) return;
    setIsFlipped(!isFlipped);
  };

  const formattedIndex = (index + 1).toString().padStart(2, "0");

  return (
    <div
      className="relative h-[450px] w-full"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{
          transformStyle: "preserve-3d",
          x: pullX,
          y: pullY,
        }}
        className="w-full h-full cursor-pointer will-change-transform"
        data-cursor="project"
      >
        {/* --- FRONT SIDE --- */}
        <motion.div
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 z-10 flex flex-col glass-panel rounded-2xl p-8 overflow-hidden bg-[#ffffff05] border border-white/10"
        >
          {/* Cinematic Reveal Mask */}
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={isInView ? { clipPath: "inset(0% 0 0 0)" } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-crimson/5 z-0"
          />

          {/* RGB Distortion Layer */}
          <RGBDistortionImage isHovered={isHovered} />

          {/* Holographic Sheen Layer */}
          <motion.div
            className="absolute inset-0 z-1 pointer-events-none opacity-40"
            style={{ background: holoGradient }}
          />

          {/* Spotlight Layer */}
          <motion.div
            className="absolute inset-0 z-2 pointer-events-none"
            style={{
              background: useTransform(
                [shineX, shineY],
                ([x, y]) =>
                  `radial-gradient(circle 200px at ${50 + (x as number)}% ${50 + (y as number)}%, rgba(230, 60, 47, 0.1), transparent)`,
              ),
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Terminal Preview */}
          <TerminalPreview
            tech={project.tech}
            isVisible={isHovered && !isFlipped}
          />

          {/* Project Content */}
          <div
            className="relative z-10 flex flex-col h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Header Reveal */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-display text-3xl text-cream tracking-wide group-hover:text-crimson transition-colors duration-300">
                {project.title}
              </h3>
            </motion.div>

            {/* Description Reveal */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-mono text-base text-muted mt-6 leading-relaxed flex-1 line-clamp-4"
            >
              {project.description}
            </motion.p>

            {/* Tech Stack - Badge Explosion */}
            <div className="flex flex-wrap gap-2 mt-8" role="list">
              {project.tech.map((tech: string, i: number) => (
                <motion.span
                  key={tech}
                  animate={
                    isHovered
                      ? {
                          x: Math.random() * 16 - 8,
                          y: Math.random() * 16 - 8,
                          rotate: Math.random() * 20 - 10,
                        }
                      : { x: 0, y: 0, rotate: 0 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                    delay: i * 0.03,
                  }}
                  className="font-mono text-xs text-muted/80 px-3 py-1.5 bg-white/5 rounded border border-white/5 backdrop-blur-sm"
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* Hint */}
            <div className="mt-8 flex justify-between items-end">
              <span className="font-body text-[10px] uppercase tracking-widest text-crimson animate-pulse">
                Click to expand
              </span>
              {project.highlight && (
                <span className="text-[10px] uppercase tracking-widest text-crimson/80 border border-crimson/30 px-2 py-1 rounded">
                  Featured
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* --- BACK SIDE --- */}
        <motion.div
          style={{
            backfaceVisibility: "hidden",
            rotateY: 180,
          }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center glass-panel rounded-2xl p-10 bg-[#0A0A0A] border border-crimson/40"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-radial-at-t from-crimson/10 to-transparent pointer-events-none" />

          <motion.span
            className="font-display text-[120px] leading-none text-crimson opacity-20 select-none"
            initial={{ scale: 0.8 }}
            animate={isFlipped ? { scale: 1 } : { scale: 0.8 }}
          >
            {formattedIndex}
          </motion.span>

          <div className="mt-4 text-center max-w-xs">
            <h4 className="font-display text-2xl text-cream mb-4">
              {project.title}
            </h4>
            <p className="font-mono text-sm text-muted mb-10 italic opacity-80 line-clamp-2">
              {project.description}
            </p>

            <div className="flex flex-col gap-4 w-full">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-crimson text-cream font-display text-lg tracking-wider rounded-lg hover:brightness-110 transition-all active:scale-95"
                >
                  <ExternalLink size={20} />
                  VIEW LIVE DEMO
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-cream font-display text-lg tracking-wider rounded-lg hover:bg-white/10 transition-all active:scale-95"
                >
                  <Github size={20} />
                  SOURCE CODE
                </a>
              )}
            </div>
          </div>

          <button className="mt-8 font-mono text-xs text-muted uppercase tracking-widest hover:text-crimson transition-colors">
            Tap to flip back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-[140px] bg-void overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* SVG Filters for distortion */}
      <svg className="absolute w-0 h-0 invisible" aria-hidden="true">
        <defs>
          <filter id="displacement-warp">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.01;0.05;0.01"
                dur="10s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
          </filter>
        </defs>
      </svg>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-crimson mb-4">
            <span className="mr-2">&#8592;</span>
            Selected Work
          </p>
          <h2
            className="font-display text-cream text-shadow-glow"
            style={{ fontSize: "clamp(44px, 7vw, 90px)" }}
          >
            Projects
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
