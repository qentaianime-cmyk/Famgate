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
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        bg:      'var(--bg)',
        'bg-1':  'var(--bg-1)',
        'bg-2':  'var(--bg-2)',
        'bg-3':  'var(--bg-3)',
        line:    'var(--line)',
        'line-2':'var(--line-2)',
        't1':    'var(--text-1)',
        't2':    'var(--text-2)',
        't3':    'var(--text-3)',
        amber:   'var(--amber)',
        'amber-low': 'var(--amber-low)',
        'amber-mid': 'var(--amber-mid)',
        emerald: 'var(--green)',
        danger:  'var(--red)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
  plugins: [],
}
