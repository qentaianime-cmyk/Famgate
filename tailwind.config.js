/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        void:    '#0A0A0A',
        surface: '#111111',
        elevated:'#1A1A1A',
        border:  '#222222',
        gold: {
          DEFAULT: '#F5A623',
          muted:   '#8B5E1A',
          dim:     '#3D2A0A',
        },
      },
      animation: {
        'fade-in':     'fadeIn 0.4s ease forwards',
        'slide-up':    'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 20px rgba(245,166,35,0.15)' }, '50%': { boxShadow: '0 0 40px rgba(245,166,35,0.35)' } },
      },
    },
  },
  plugins: [],
}
