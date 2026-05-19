import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-void">
      <div className="text-center px-6">
        <h1 className="font-display text-cream" style={{ fontSize: 'clamp(80px, 20vw, 180px)', lineHeight: 1 }}>
          404
        </h1>
        <p className="font-mono text-muted mt-4 text-lg">Page not found</p>
        <p className="font-mono text-muted/60 mt-2 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex mt-8 px-6 py-3 rounded-full bg-crimson text-void font-body text-sm uppercase tracking-[0.1em] hover:bg-fire-orange transition-colors focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-void"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}