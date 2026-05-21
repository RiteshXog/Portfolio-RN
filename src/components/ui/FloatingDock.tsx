// src/components/ui/FloatingDock.tsx
import React, { useEffect, useRef, useState } from "react";
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

function DockItem({
  item,
  mouseX,
  isActive,
  isMobile,
}: {
  item: NavItem;
  mouseX: MotionValue;
  isActive: boolean;
  isMobile: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [36, 54, 36]);
  const widthSpring = useSpring(widthTransform, {
    stiffness: 300,
    damping: 20,
  });

  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector(item.href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="relative flex flex-col items-center group"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && !isMobile && !shouldReduceMotion && (
          <motion.span
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            className="absolute -top-10 left-1/2 px-2 py-1 bg-[#0a0a0a] border border-white/10 rounded text-[9px]
            font-mono text-white tracking-widest pointer-events-none whitespace-nowrap z-[110]"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        style={{
          width: isMobile || shouldReduceMotion ? 36 : widthSpring,
          height: isMobile || shouldReduceMotion ? 36 : widthSpring,
        }}
        className={`flex items-center justify-center rounded-full transition-colors duration-300 relative bg-transparent ${
          isActive ? "text-[#e63c2f]" : "text-white/40 hover:text-white"
        }`}
      >
        <item.icon size={isMobile ? 16 : 18} strokeWidth={isActive ? 2 : 1.5} />

        {isActive && (
          <motion.div
            layoutId="activeDot"
            className="absolute -bottom-1.5 rounded-full bg-[#e63c2f]"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: '4px', height: '4px' }}
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
  const mouseX = useMotionValue(Infinity);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Active section detection using scroll position
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

  return (
    <motion.div
      initial={{ y: 0, x: "-50%", opacity: 1 }}
      animate={{
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseMove={(e) => !isMobile && mouseX.set(e.pageX)}
      onMouseLeave={() => !isMobile && mouseX.set(Infinity)}
      className="fixed bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-3 py-2
      md:px-5 md:py-2.5 bg-[#0a0a0a]/70 backdrop-blur-xl border border-white/[0.08] rounded-full
      shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.4)] will-change-transform"
    >
      {NAV_ITEMS.map((item) => (
        <DockItem
          key={item.label}
          item={item}
          mouseX={mouseX}
          isActive={activeSection === item.href.slice(1)}
          isMobile={isMobile}
        />
      ))}
    </motion.div>
  );
}