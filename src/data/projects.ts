export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  github?: string
  demo?: string
  highlight?: boolean
}

export const projects: Project[] = [
  {
    id: 'weather-app',
    title: 'Weather Dashboard',
    description: 'A responsive weather application with real-time data, 7-day forecasts, and location-based predictions. Features interactive maps and beautiful UI transitions.',
    tech: ['React', 'TypeScript', 'OpenWeather API', 'Framer Motion'],
    github: 'https://github.com/RiteshXog/weather-app',
    demo: 'https://riteshxog.github.io/Weather-app/',
    highlight: true,
  },
  {
    id: 'task-manager',
    title: 'Task Management System',
    description: 'A clean productivity app for managing tasks, deadlines, and project workflows. Includes Kanban boards, drag-and-drop, and local storage persistence.',
    tech: ['React', 'Redux Toolkit', 'TypeScript', 'CSS Modules'],
    github: 'https://github.com/RiteshXog/task-manager',
    demo: 'https://riteshxog.github.io/Task-Manager/',
  },
  {
    id: 'portfolio-v1',
    title: 'Portfolio Generator',
    description: 'A static site generator for creating developer portfolios. Supports Markdown content, custom themes, and optimized image loading.',
    tech: ['Next.js', 'Node.js', 'Markdown', 'Vercel'],
    github: 'https://github.com/RiteshXog/portfolio-generator',
  },
  {
    id: 'ecommerce-store',
    title: 'E-Commerce Platform',
    description: 'A full-featured online store with cart management, checkout flow, and admin dashboard. Built with modern frontend best practices.',
    tech: ['React', 'Context API', 'Stripe API', 'Tailwind'],
    github: 'https://github.com/RiteshXog/ecommerce-store',
  },
]

export const skills = {
  languages: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'C++'],
  frontend: ['React', 'Next.js', 'HTML5', 'CSS3', 'Sass'],
  tools: ['Git', 'VS Code', 'Figma', 'Chrome DevTools', 'npm'],
}

export const socialLinks = {
  github: 'https://github.com/RiteshXog',
  linkedin: 'https://www.linkedin.com/in/ritesh-naik-5b9370409/',
  email: 'mailto:hsetirkian777@gmail.com',
  twitter: 'https://twitter.com/ritesh_codes',
}