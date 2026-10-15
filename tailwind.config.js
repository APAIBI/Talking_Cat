/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bubble: {
          pink: '#FF6B8B',
          yellow: '#FFD166',
          blue: '#4D96FF',
          green: '#06D6A0',
          purple: '#9B5DE5',
          coral: '#F15BB5',
          softBg: '#F0F9FF',
        }
      },
      fontFamily: {
        comic: ['"Fredoka"', '"Nunito"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-gentle': 'bounceGentle 2s infinite ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
