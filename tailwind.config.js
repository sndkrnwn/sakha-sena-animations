/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'cursive', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
      colors: {
        sakhablue: {
          DEFAULT: '#3B82F6',
          light: '#93C5FD',
          dark: '#1D4ED8',
          soft: '#EFF6FF',
        },
        senared: {
          DEFAULT: '#EF4444',
          light: '#FCA5A5',
          dark: '#B91C1C',
          soft: '#FEF2F2',
        },
        sunyellow: {
          DEFAULT: '#FBBF24',
          light: '#FDE68A',
          dark: '#D97706',
          soft: '#FFFBEB',
        },
        mintgreen: {
          DEFAULT: '#10B981',
          light: '#6EE7B7',
          dark: '#047857',
          soft: '#ECFDF5',
        },
        lavender: '#8B5CF6'
      },
      boxShadow: {
        'bubbly': '0 10px 0 0 rgba(0,0,0,0.08), 0 15px 25px -5px rgba(0,0,0,0.1)',
        'bubbly-blue': '0 8px 0 0 #2563EB',
        'bubbly-red': '0 8px 0 0 #DC2626',
        'bubbly-yellow': '0 8px 0 0 #D97706',
        'bubbly-green': '0 8px 0 0 #059669',
        'card-float': '0 20px 30px -10px rgba(0,0,0,0.07)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) rotate(-4deg)' },
        },
        pulseSlow: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
      }
    }
  },
  plugins: [],
}
