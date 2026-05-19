# Ritesh Naik Portfolio - Project Handoff Document

## 1. Project Overview

**Project Name:** Ritesh Naik Portfolio
**Purpose:** Personal portfolio website for a frontend developer (BCA student at PCCOER, Pune)
**Target Audience:** Recruiters, potential clients, collaborators
**Deployment Target:** Vercel

A React-based single-page portfolio showcasing the developer's skills, projects, and contact information with premium UI effects and smooth animations.

---

## 2. Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Smooth Scroll | Lenis |
| Scroll Triggers | GSAP + ScrollTrigger |
| Icons | Lucide React |
| Fonts | JetBrains Mono, Bebas Neue, Cormorant Garamond |

---

## 3. File Structure

```
app/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── MagneticButton.tsx    # Magnetic hover effect button
│   │   │   ├── LoadingScreen.tsx     # Initial loading animation
│   │   │   ├── BackToTop.tsx         # Scroll to top button
│   │   │   ├── Marquee.tsx           # Horizontal scrolling ticker
│   │   │   ├── StatsCounter.tsx      # Animated statistics display
│   │   │   ├── SectionIndicator.tsx  # Fixed right-side nav dots
│   │   │   ├── TiltCard.tsx          # 3D tilt effect for cards
│   │   │   ├── TextScramble.tsx      # Glitch text reveal animation
│   │   │   ├── TextReveal.tsx         # Scroll-triggered text reveal
│   │   │   ├── SplitText.tsx         # Letter-by-letter animation
│   │   │   ├── PageTransition.tsx     # Page transition effects
│   │   │   ├── MagneticHorizon.tsx   # Parallax horizon effect
│   │   │   ├── ParticleField.tsx      # Canvas particle system
│   │   │   ├── CodeRain.tsx          # Matrix-style code rain
│   │   │   ├── FloatingShapes.tsx     # Animated geometric shapes
│   │   │   ├── Typewriter.tsx         # Typing animation
│   │   │   ├── MouseTrail.tsx         # Custom cursor trail
│   │   │   ├── LoomGrid.tsx           # Interactive canvas grid
│   │   │   ├── SpotlightReveal.tsx    # Mouse-following spotlight
│   │   │   ├── GlitchText.tsx         # Glitch effect on hover
│   │   │   ├── EasterEgg.tsx          # Konami code easter egg
│   │   │   ├── SplitTransition.tsx    # Split screen page transitions
│   │   │   └── HeroReveal.tsx         # Cinematic scroll-pinned hero
│   │   ├── AtmosphericBackground.tsx   # Ambient background effects
│   │   ├── CustomCursor.tsx           # Custom cursor implementation
│   │   └── PlasmaCanvas.tsx           # Plasma animation canvas
│   │
│   ├── sections/                 # Page sections
│   │   ├── Nav.tsx               # Navigation bar with mobile menu
│   │   ├── Hero.tsx              # Hero section with name & photo
│   │   ├── About.tsx              # About section with bio & skills
│   │   ├── Services.tsx           # Services offered (3D tilt cards)
│   │   ├── Projects.tsx          # Project showcase grid
│   │   ├── CTABanner.tsx          # Call-to-action banner
│   │   ├── Contact.tsx            # Contact form
│   │   └── Footer.tsx             # Footer with social links
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useMousePosition.ts    # Track cursor position
│   │   ├── useScrollDirection.ts  # Detect scroll direction
│   │   ├── useScrollVelocity.ts   # Calculate scroll speed for skew
│   │   ├── useMobile.ts           # Mobile device detection
│   │   └── useKonamiCode.ts        # Konami code detection
│   │
│   ├── lib/                      # Utilities
│   │   ├── utils.ts               # General utilities (cn function)
│   │   └── motion.ts              # Shared Framer Motion variants
│   │
│   ├── data/
│   │   └── projects.ts            # Project data, skills, social links
│   │
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles + Tailwind
│
├── public/                       # Static assets
│   ├── hero5.webp                # Hero portrait
│   ├── about3.webp               # About section photo
│   └── resume/                   # Resume PDF
│
├── index.html                    # HTML entry point with OG tags
├── tailwind.config.js            # Tailwind configuration
└── vite.config.ts               # Vite configuration
```

---

## 4. Key Components

### Navigation (Nav.tsx)
- Fixed position with blur background on scroll
- Mobile hamburger menu with slide-out panel
- Active section highlighting
- Smooth scroll to sections

### Hero Section (Hero.tsx)
- Animated name with TextScramble effect
- Terminal cursor blink
- Photo with chromatic aberration hover effect
- Pulsing "Open to Work" badge
- Social links with hover animations

### About Section (About.tsx)
- Two-column layout (photo + bio)
- GSAP scroll-triggered reveal animations
- Skill badges
- Resume download link

### Services Section (Services.tsx)
- 3D tilt cards using VanillaTilt
- Staggered reveal on scroll

### Projects Section (Projects.tsx)
- Grid layout with hover effects
- Featured project highlighting
- Tech stack badges
- GitHub & Live links

### Contact Section (Contact.tsx)
- Form with validation
- Social links
- Email display

### Footer (Footer.tsx)
- Social links
- Copyright text
- Built with love message

---

## 5. Design System

### Colors
| Name | Value | Usage |
|------|-------|-------|
| void | #0a0a0a | Background |
| cream | #f5f5dc | Primary text |
| crimson | #e63c2f | Accent color |
| muted | rgba(255,255,255,0.6) | Secondary text |

### Typography
- **Display:** Bebas Neue (headings, large text)
- **Body:** JetBrains Mono (paragraphs, code)
- **Accent:** Cormorant Garamond (elegant text)

### Effects
- Glass morphism: `backdrop-filter: blur(10px)`
- Glow effects: Box shadows with crimson
- Gradients: Crimson radial gradients for ambient lighting

---

## 6. Premium Features Implemented

### Smooth Scrolling
- Lenis integrated for buttery smooth scroll
- Custom scrollbar styling (thin, crimson)

### Custom Cursor
- Follows mouse with smooth interpolation
- Adapts to different elements (text, images, buttons)

### Loading Screen
- Initial page load animation
- Staggered text reveal

### Micro-interactions
- Magnetic buttons (pull toward cursor on hover)
- Button press animations (scale down on click)
- Link underline animations
- Card hover effects

### Ambient Backgrounds
- AtmosphericBackground component with:
  - Animated SVG noise
  - Breathing orbs
  - Mouse-reactive spotlight
  - Vignette effect

### Easter Eggs
- Konami code (↑↑↓↓←→←→BA) triggers celebration popup
- Particle explosion effect

---

## 7. Recent Changes

### Current State (After Emergency Reverts)
- Hero: Original two-column layout with TextScramble animation
- About: Original two-column layout with GSAP scroll reveals
- Projects: Original vertical grid layout
- All broken cinematic features reverted
- Site loads without black screen
- Scroll works normally

### Previously Attempted (Reverted)
- ❌ Cinematic scroll-pinned hero (broke scroll lock)
- ❌ Bento grid for About (broke layout)
- ❌ Horizontal scroll gallery for Projects (broke mobile)
- ❌ KineticText component (unused)
- ❌ HeroReveal component (caused issues)

---

## 8. Blockers / Known Issues

1. **Performance**: Large bundle size (529KB) - consider code splitting
2. **Mobile**: Some canvas effects may impact performance
3. **Build Warning**: `duration-[2000ms]` class is ambiguous in Tailwind

---

## 9. Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 10. Deployment

This project is configured for Vercel deployment. Simply connect the repository to Vercel and it will auto-detect the configuration.

**Build Command:** `npm run build`
**Output Directory:** `dist`

---

## 11. Next Steps (If You Want to Continue Adding Features)

1. **Add horizontal project gallery** - Implement with careful mobile fallback
2. **Add scroll-pinned hero** - Use Framer Motion's useScroll without blocking Lenis
3. **Optimize bundle** - Add code splitting for heavy canvas components
4. **Add more projects** - Update projects.ts with real work
5. **SEO optimization** - Add more meta tags if needed

---

## 12. Important Notes

- All sections use `id` attributes for anchor navigation
- Lenis must NOT be stopped - always let it run naturally
- Avoid `position: fixed` with `overflow: hidden` on body (breaks scroll)
- Canvas components should check for reduced motion preference
- Mobile detection uses both viewport width and touch capability

---

*Generated for agent handoff. Use this document to understand the project state and continue development.*