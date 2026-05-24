// src/components/ui/FloatingDock.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { Home, User, Code2, Layers, Mail, type LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', icon: Home, href: '#home' },
  { label: 'ABOUT', icon: User, href: '#about' },
  { label: 'SERVICES', icon: Layers, href: '#services' },
  { label: 'PROJECTS', icon: Code2, href: '#projects' },
  { label: 'CONTACT', icon: Mail, href: '#contact' },
];

/**
 * Click Ripple Effect Component
 */
function ClickRipple({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.span
      initial={{ width: 0, height: 0, opacity: 0.3 }}
      animate={{ width: 48, height: 48, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e63c2f]/40 pointer-events-none z-0"
    />
  );
}

function DockItem({
  item,
  mouseX,
  isActive,
}: {
  item: NavItem;
  mouseX: MotionValue;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(distance, [-150, 0, 150], [40, 58, 40]);
  const sizeSpring = useSpring(sizeTransform, {
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowRipple(true);
    const element = document.querySelector(item.href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Label - Fixed Above Dock */}
      <AnimatePresence>
        {isHovered && !shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0, y: 6, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 6, x: "-50%" }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-[calc(100%+12px)] left-1/2 whitespace-nowrap z-[999] pointer-events-none"
          >
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/85 backdrop-blur-xl border border-white/10 rounded shadow-2xl">
              <span className="text-[#e63c2f] leading-none">•</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white">
                {item.label}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: shouldReduceMotion ? 40 : sizeSpring,
          height: shouldReduceMotion ? 40 : sizeSpring,
        }}
        className="relative flex items-center justify-center rounded-full transition-colors duration-300 group outline-none"
      >
        {/* Light Bloom Hover Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-full blur-[6px] pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(230, 60, 47, 0.12) 0%, transparent 70%)"
              }}
            />
          )}
        </AnimatePresence>

        {/* Click Ripple */}
        <AnimatePresence>
          {showRipple && <ClickRipple onComplete={() => setShowRipple(false)} />}
        </AnimatePresence>

        {/* Icon */}
        <div 
          className={`relative z-10 transition-all duration-300 ${
            isActive ? "text-[#e63c2f]" : "text-white/40 group-hover:text-white"
          }`}
          style={{
            filter: isActive ? "drop-shadow(0 0 4px rgba(230, 60, 47, 0.5))" : "none"
          }}
        >
          <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
        </div>

        {/* Active Dot Indicator */}
        {isActive && (
          <motion.div
            layoutId="activeDot"
            className="absolute -bottom-1.5 w-[3px] h-[3px] rounded-full bg-[#e63c2f]"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </div>
  );
}

export default function FloatingDock() {
  const [activeSection, setActiveSection] = useState("home");
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  
  const mouseX = useMotionValue(Infinity);
  const { scrollY } = useScroll();

  // Handle Mobile Detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Handle Visibility on Scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  // Handle Active Section Detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'projects', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const bottom = top + element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isMobile) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center">
      {/* Main Dock Container Wrapper for Reflection Clipping */}
      <div className="relative group/dock">
        {/* Reflection */}
        <div 
          className="absolute top-[calc(100%+4px)] left-0 right-0 h-full flex justify-center opacity-[0.08] pointer-events-none blur-[3px] scale-y-[-1]"
          style={{ 
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 80%)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 80%)"
          }}
        >
          <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-full border border-white/10">
            {NAV_ITEMS.map((item) => (
               <div key={`ref-${item.label}`} className="w-10 h-10 flex items-center justify-center text-white/10">
                  <item.icon size={20} />
               </div>
            ))}
          </div>
        </div>

        {/* Main Dock Pill */}
        <motion.div
          animate={{
            y: isVisible ? 0 : 100,
            opacity: isVisible ? 1 : 0,
            boxShadow: isContainerHovered
              ? "0 0 0 1px rgba(230, 60, 47, 0.15), 0 20px 60px rgba(0,0,0,0.6), 0 0 25px rgba(230, 60, 47, 0.08)"
              : "0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 40px rgba(0, 0, 0, 0.5)",
          }}
          transition={{
            y: { duration: 0.4, ease: "easeInOut" },
            boxShadow: { duration: 0.4, ease: "easeOut" },
            opacity: isContainerHovered 
              ? { duration: 0.2 } 
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          onMouseEnter={() => setIsContainerHovered(true)}
          onMouseLeave={() => {
            setIsContainerHovered(false);
            mouseX.set(Infinity);
          }}
          onMouseMove={(e) => mouseX.set(e.pageX)}
          className="relative flex items-center gap-4 px-4 py-3 bg-[#0a0a0a]/85 backdrop-blur-2xl border border-white/[0.08] rounded-full will-change-transform"
        >
          {NAV_ITEMS.map((item) => (
            <DockItem
              key={item.label}
              item={item}
              mouseX={mouseX}
              isActive={activeSection === item.href.slice(1)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
