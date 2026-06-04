/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './store/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne:    ['var(--font-syne)',    'system-ui', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-jbmono)',  'monospace'],
      },
      colors: {
        void:    '#07070f',
        depth:   '#0d0c1a',
        surface: '#13122b',
        raised:  '#1a1936',
        violet: {
          hi:  '#8b5cf6',
          DEFAULT: '#7c3aed',
          lo:  '#4c1d95',
          glow:'rgba(124,58,237,0.35)',
        },
        ink: {
          1: '#ededff',
          2: '#8585a8',
          3: '#4d4d70',
          4: '#2a2a45',
        },
        qline: 'rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'violet-gradient': 'linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#3b82f6 100%)',
        'subtle-gradient': 'linear-gradient(135deg,#13122b,#0d0c1a)',
      },
      keyframes: {
        'blob-drift': {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%':     { transform: 'translate(30px,-20px) scale(1.05)' },
          '66%':     { transform: 'translate(-20px,15px) scale(0.97)' },
        },
        'glow-pulse': {
          '0%,100%': { opacity: '0.5' },
          '50%':     { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'blob-a':   'blob-drift 9s  ease-in-out infinite',
        'blob-b':   'blob-drift 12s ease-in-out infinite reverse',
        'blob-c':   'blob-drift 15s ease-in-out infinite 3s',
        'glow':     'glow-pulse 2.5s ease-in-out infinite',
        shimmer:    'shimmer 2s linear infinite',
        'fade-up':  'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        spin:       'spin 0.7s linear infinite',
      },
    },
  },
  plugins: [],
}
