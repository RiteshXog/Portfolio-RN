import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Linkedin, Github } from 'lucide-react'
import { socialLinks } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: isMobile ? 0.2 : 0.4, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } })
      gsap.fromTo(rightRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: isMobile ? 0.2 : 0.4, delay: isMobile ? 0 : 0.08, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('idle')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Replace with your Formspree form ID
      const response = await fetch('https://formspree.io/f/xkoyenbn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const contactItems = [
    { icon: Mail, label: 'Email', value: 'hsetirkian777@gmail.com', href: socialLinks.email },
    { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/ritesh-naik', href: socialLinks.linkedin },
    { icon: Github, label: 'GitHub', value: 'github.com/RiteshXog', href: socialLinks.github },
  ]

  return (
    <section id="contact" ref={sectionRef} className="relative py-[100px]" style={{ zIndex: 1 }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div ref={leftRef}>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-crimson mb-4">
              <span className="mr-2">&#8592;</span>
              Contact
            </p>
            <h2 className="font-serif text-cream font-light" style={{ fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.1 }}>
              Get In Touch
            </h2>
            <p className="font-mono text-base text-muted mt-4 max-w-sm">
              Open to freelance projects, internships, or just a conversation about web development,software development.
            </p>

            <div className="mt-8 space-y-4" role="list" aria-label="Contact information">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group" role="listitem">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-crimson group-hover:bg-crimson/10 transition-all duration-300">
                    <Icon size={18} className="text-crimson" />
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.15em] text-muted">{label}</p>
                    <p className="font-mono text-base text-cream group-hover:text-crimson transition-colors">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div ref={rightRef} className="glass-panel rounded-xl p-8">
            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-crimson/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-cream mb-2">Message Sent!</h3>
                <p className="font-mono text-sm text-muted">Thanks for reaching out. I'll get back to you soon.</p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="mt-6 text-crimson hover:text-cream transition-colors font-mono text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Name Field */}
                <div className="mb-4">
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-transparent border-b py-4 font-mono text-base text-cream placeholder-muted/40 focus:outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-white/15 focus:border-crimson'}`}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-xs text-red-500 font-mono" role="alert">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-transparent border-b py-4 font-mono text-base text-cream placeholder-muted/40 focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-white/15 focus:border-crimson'}`}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-500 font-mono" role="alert">{errors.email}</p>
                  )}
                </div>

                {/* Message Field */}
                <div className="mb-6">
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full bg-transparent border-b py-4 font-mono text-base text-cream placeholder-muted/40 focus:outline-none transition-colors resize-none ${errors.message ? 'border-red-500' : 'border-white/15 focus:border-crimson'}`}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-xs text-red-500 font-mono" role="alert">{errors.message}</p>
                  )}
                </div>

                {/* Error State */}
                {submitStatus === 'error' && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-sm text-red-400 font-mono">Something went wrong. Please try again or email directly.</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full font-body text-sm font-medium uppercase tracking-[0.1em] bg-crimson text-void transition-all duration-300 hover:bg-gradient-to-r hover:from-crimson hover:to-fire-orange disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}