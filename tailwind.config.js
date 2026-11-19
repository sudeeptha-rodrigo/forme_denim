/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F9F8F6',
        cream: '#F4F1EA',
        sand: '#E6E1D8',
        charcoal: {
          light: '#262626',
          DEFAULT: '#141414',
          dark: '#0A0A0A',
          deep: '#050505',
        },
        denim: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#16233B',
          raw: '#131E29',
          selvedge: '#C92A2A',
          wash: '#7C93A8',
        },
        muted: {
          DEFAULT: '#737373',
          light: '#A3A3A3',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Cinzel"', '"Didot"', '"Bodoni MT"', 'serif'],
        editorial: ['"Italiana"', '"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'ultra-wide': '0.25em',
        'mega-wide': '0.35em',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
