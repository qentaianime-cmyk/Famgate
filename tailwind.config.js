/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './store/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        void:     '#0A0A0A',
        surface:  '#111111',
        elevated: '#1A1A1A',
        border:   '#222222',
        gold: {
          DEFAULT: '#F5A623',
          muted:   '#8B5E1A',
          dim:     '#3D2A0A',
        },
      },
    },
  },
  plugins: [],
}
