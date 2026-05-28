# Ritesh Naik — Personal Portfolio Website

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?style=flat-square&logo=framer&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A cinematic, dark-noir personal portfolio website built with React, TypeScript, and Framer Motion. Designed to showcase frontend development skills with premium UI interactions, physics-based animations, and a fully responsive layout.

---

## 🌐 Live Demo

**[riteshxog.github.io/Portfolio-RN](https://riteshxog.github.io/Portfolio-RN/)**

---

## ✨ Features

- **Cinematic Dark UI** — Void black base with crimson accents and atmospheric depth effects
- **Floating Dock Navigation** — macOS-style magnetic floating dock on desktop with smooth active section detection
- **Live Scroll Indicator** — Real-time vertical progress tracker with animated section tracking
- **Premium Animations** — Physics-based spring animations, text scramble effects, and scroll-driven reveals powered by Framer Motion
- **3D Card Effects** — Interactive tilt cards on service and project sections with glossy shine overlay
- **Custom Cursor** — Smooth trailing cursor with context-aware states
- **Loading Screen** — Cinematic intro loader before site reveal
- **Konami Code Easter Egg** — Hidden secret unlocked with the classic cheat code sequence
- **Contact Form** — Functional contact form with Formspree integration sending emails directly
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop with separate mobile navigation
- **Performance Optimized** — Lazy loaded sections, WebP images, and Lenis smooth scroll
- **SEO Ready** — Open Graph tags, Twitter Card meta, JSON-LD Person schema, robots.txt, sitemap.xml
- **Accessible** — Reduced motion support, semantic HTML, ARIA labels, keyboard navigation

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 11 |
| Smooth Scroll | Lenis |
| Icons | Lucide React |
| Form Backend | Formspree |
| Deployment | GitHub Pages via gh-pages |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/RiteshXog/Portfolio-RN.git

# Navigate into the project
cd Portfolio-RN

# Install dependencies
npm install
```

### Local Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## 📦 Deployment

This project is deployed to **GitHub Pages** using the `gh-pages` package.

### How it works

The `gh-pages` package builds the project and pushes the output to a dedicated `gh-pages` branch, which GitHub Pages serves automatically.

### Deploy

```bash
# Build and deploy to GitHub Pages in one command
npm run deploy
```

This runs `npm run build && gh-pages -d dist` and pushes the `dist` folder to the `gh-pages` branch.

### Configuration

The `vite.config.ts` has the base path set to match the GitHub Pages repository URL:

```ts
export default defineConfig({
  base: '/Portfolio-RN/',
  plugins: [react()],
})
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── FloatingDock.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── EasterEgg.tsx
│   │   ├── StatsCounter.tsx
│   │   ├── Marquee.tsx
│   │   └── ...
│   ├── AtmosphericBackground.tsx
│   └── CustomCursor.tsx
├── sections/            # Page sections
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── Projects.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── data/
│   └── projects.ts      # Project and social link data
├── lib/
│   └── motion.ts        # Shared Framer Motion variants
├── hooks/               # Custom React hooks
├── App.tsx
└── main.tsx
public/
├── resume/              # CV PDF
├── hero5.webp           # Hero portrait
├── about1.webp          # About portrait
├── og-image.png         # Social share image
├── robots.txt
└── sitemap.xml
```

---

## 🎮 Easter Egg

Try the **Konami Code** on the live site:

```
↑ ↑ ↓ ↓ ← → ← → B A
```

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Ritesh Naik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🤝 Connect

- **Portfolio** — [riteshxog.github.io/Portfolio-RN](https://riteshxog.github.io/Portfolio-RN/)
- **GitHub** — [@RiteshXog](https://github.com/RiteshXog)
- **LinkedIn** — [ritesh-naik](https://www.linkedin.com/in/ritesh-naik-5b9370409/)
- **Twitter/X** — [@RiteshNaik_07](https://x.com/RiteshNaik_07)

---

<p align="center">Built with ❤️ and way too much caffeine by Ritesh Naik</p>
