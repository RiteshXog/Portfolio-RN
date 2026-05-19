/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0A0A',
        carbon: '#111111',
        crimson: '#b74b4b',
        'fire-orange': '#ff8c00',
        'flame-red': '#ff1d15',
        cream: '#FAFAFA',
        muted: '#888888',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(80px, 12vw, 160px)', { lineHeight: 0.9 }],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(183, 75, 75, 0.2)',
        'glow-md': '0 0 25px rgba(183, 75, 75, 0.3)',
      },
      backgroundImage: {
        'gradient-crimson': 'linear-gradient(270deg, #b74b4b, #ff8c00)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}