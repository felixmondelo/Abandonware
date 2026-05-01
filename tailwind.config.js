/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      colors: {
        dos: {
          bg: '#000000',
          text: '#00ff41',
          accent: '#00b32c',
          card: '#001a00',
          border: '#00ff41',
        },
        spectrum: {
          bg: '#000000',
          text: '#ffffff',
          accent: '#ff0000',
          card: '#1a1a1a',
          border: '#ffffff',
        },
        msx: {
          bg: '#1a1a2e',
          text: '#4fc3f7',
          accent: '#e91e63',
          card: '#162447',
          border: '#4fc3f7',
        },
        amiga: {
          bg: '#2a2d6b',
          text: '#ffffff',
          accent: '#ff6600',
          card: '#1e2057',
          border: '#ff6600',
        },
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'boot': 'boot 0.5s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%': { opacity: '0.97' },
          '5%': { opacity: '0.95' },
          '10%': { opacity: '0.97' },
          '15%': { opacity: '0.94' },
          '20%': { opacity: '0.98' },
          '50%': { opacity: '0.96' },
          '80%': { opacity: '0.95' },
          '100%': { opacity: '0.97' },
        },
        boot: {
          '0%': { opacity: '0', transform: 'scaleY(0.01)' },
          '50%': { opacity: '1', transform: 'scaleY(0.01)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
}
