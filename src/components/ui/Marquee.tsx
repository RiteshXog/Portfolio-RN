import { useReducedMotion } from 'framer-motion'

const marqueeText = 'FRONTEND DEVELOPER • REACT • TYPESCRIPT • NEXT.JS • OPEN TO WORK • RITESH NAIK • HTML5 • CSS3 • JAVASCRIPT • UI DESIGN • CLEAN CODE • FAST WEBSITES • '

export default function Marquee() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div
        style={{
          height: '32px',
          padding: '8px 0',
          backgroundColor: '#e63c2f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: 'white',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Frontend Developer • React • TypeScript • Open to Work
        </span>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        height: '32px',
        padding: '8px 0',
        backgroundColor: '#e63c2f',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        className="marquee-content"
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'marquee-scroll 30s linear infinite',
        }}
      >
        <span
          style={{
            color: 'white',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {marqueeText.repeat(4)}
        </span>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}