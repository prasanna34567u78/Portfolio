/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        indigo: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        surface: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          lighter: '#334155',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        blink: 'blink 3s ease-in-out infinite',
        'head-idle': 'headIdle 6s ease-in-out infinite',
        'waveform': 'waveform 1s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.05)' },
        },
        headIdle: {
          '0%, 100%': { transform: 'rotate(0deg) translateX(0)' },
          '25%': { transform: 'rotate(1deg) translateX(2px)' },
          '75%': { transform: 'rotate(-1deg) translateX(-2px)' },
        },
        waveform: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '20px' },
        },
      },
    },
  },
  plugins: [],
}
