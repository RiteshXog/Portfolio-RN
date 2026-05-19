import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Linkedin, Github, Twitter } from "lucide-react";
import { socialLinks } from "../data/projects";
import MagneticButton from "../components/ui/MagneticButton";
import TextScramble from "../components/ui/TextScramble";
import { fadeUp, stagger } from "../lib/motion";

const socialItems = [
  { icon: Github, href: socialLinks.github, label: "GitHub" },
  { icon: Linkedin, href: socialLinks.linkedin, label: "LinkedIn" },
  { icon: Twitter, href: socialLinks.twitter, label: "Twitter" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const greetingWords = ["To", "be", "a", "Software", "Developer"];

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center"
      style={{ zIndex: 1 }}
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-8 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="order-2 lg:order-1">
            {/* Greeting line with word stagger */}
            <motion.div
              className="flex flex-wrap gap-2 mb-4"
              aria-label="To be a Software Developer"
              role="text"
              variants={shouldReduceMotion ? {} : stagger}
              initial="hidden"
              animate="visible"
            >
              {greetingWords.map((word, i) => (
                <motion.span
                  key={i}
                  variants={shouldReduceMotion ? {} : fadeUp}
                  className="font-body text-xs uppercase tracking-[0.2em] text-crimson"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>

            <h1
              className="font-display text-cream text-shadow-glow"
              style={{ fontSize: "clamp(56px, 10vw, 120px)", lineHeight: 0.95 }}
            >
              <TextScramble text="RITESH" className="block" />
              <br />
              <TextScramble
                text="NAIK"
                className="block text-gradient-animated"
              />
              {/* Terminal cursor blink */}
              <span
                className="inline-block w-[3px] h-[0.9em] bg-crimson ml-1"
                style={{
                  animation: "terminal-blink 1s steps(2, start) infinite",
                  verticalAlign: "middle",
                }}
              />
            </h1>

            <motion.p
              className="font-mono text-base text-muted mt-6 max-w-md leading-relaxed"
              variants={shouldReduceMotion ? {} : fadeUp}
              initial="hidden"
              animate="visible"
            >
              I build things for the web. Skilled in C++, Python, SQL, HTML, CSS
              & JavaScript. Currently pursuing BCA at PCCOER, Pune. Always
              learning • Open to freelance & internships.
            </motion.p>

            {/* Open to Work badge */}
            <motion.div
              className="inline-flex items-center gap-2 mt-6 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(230,60,47,0.1)",
                backdropFilter: "blur(8px)",
              }}
              variants={shouldReduceMotion ? {} : fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div className="relative">
                {/* Static ring */}
                <div className="w-2 h-2 rounded-full bg-green-500" />
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-green-500"
                  animate={{ scale: [1, 2.5], opacity: [1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              </div>
              <span className="font-body text-[10px] uppercase tracking-[0.15em] text-green-400">
                Open to Work
              </span>
            </motion.div>

            <motion.div
              className="mt-8"
              variants={shouldReduceMotion ? {} : fadeUp}
              initial="hidden"
              animate="visible"
            >
              <MagneticButton
                onClick={() =>
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-gradient pill-btn text-void font-medium"
              >
                Get In Touch
              </MagneticButton>
            </motion.div>

            <motion.div
              className="flex items-center gap-4 mt-8"
              role="list"
              aria-label="Social links"
              variants={shouldReduceMotion ? {} : stagger}
              initial="hidden"
              animate="visible"
            >
              {socialItems.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-muted transition-all duration-300 hover:btn-gradient hover:text-void hover:border-transparent hover:scale-110"
                  variants={shouldReduceMotion ? {} : fadeUp}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right - Image with SVG border trace */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end group">
            <div
              className="relative"
              style={{ maxWidth: "380px", width: "100%" }}
            >
              {/* SVG border trace */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 2 }}
              >
                <motion.rect
                  x="2"
                  y="2"
                  width="calc(100% - 4px)"
                  height="calc(100% - 4px)"
                  fill="none"
                  stroke="#b74b4b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                  rx="12"
                  initial={{ strokeDashoffset: 1000 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>

              {/* Glow */}
              <div
                className="absolute inset-0 rounded-lg blur-[60px] opacity-30"
                style={{
                  background:
                    "radial-gradient(circle, rgba(183, 75, 75, 0.5) 0%, transparent 70%)",
                }}
              />

              {/* Image container */}
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  data-cursor="image"
                  src="/hero5.webp"
                  alt="Ritesh Naik - Web Developer based in Pune"
                  width="380"
                  height="506"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  fetchPriority="high"
                  decoding="async"
                  style={{ filter: "brightness(0.85) contrast(1.05)" }}
                />

                {/* Chromatic aberration */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,0,0,0.3) 0%, transparent 50%, rgba(0,0,255,0.3) 100%)",
                    mixBlendMode: "screen",
                  }}
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 40%, rgba(183, 75, 75, 0.2) 60%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}