import { Github, Linkedin, Twitter } from 'lucide-react'
import { socialLinks } from '../data/projects'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const socialItems = [
  { icon: Github, href: socialLinks.github, label: 'GitHub' },
  { icon: Linkedin, href: socialLinks.linkedin, label: 'LinkedIn' },
  { icon: Twitter, href: socialLinks.twitter, label: 'Twitter' },
]

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-void" style={{ zIndex: 1 }} role="contentinfo">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-crimson/30 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-crimson to-fire-orange" aria-hidden="true" />
            <span className="font-display text-sm tracking-[0.1em] text-cream">RITESH NAIK</span>
          </div>

          {/* Nav */}
          <nav role="list" aria-label="Footer navigation">
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="font-body text-[10px] uppercase tracking-[0.15em] text-muted hover:text-cream focus:text-cream focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-void rounded transition-colors"
                  role="listitem"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4" role="list" aria-label="Social media links">
            {socialItems.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted hover:text-crimson focus:text-crimson focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-void rounded p-1 transition-colors"
                role="listitem"
              >
                <Icon size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/[0.02] text-center">
          <p className="font-mono text-[11px] text-[#555]">
            &copy; {currentYear} Ritesh Naik. Built with React & Tailwind.
          </p>
        </div>
      </div>
    </footer>
  )
}