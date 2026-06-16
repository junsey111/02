/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        "ink-soft": "#141414",
        bone: "#f4efe6",
        "bone-dim": "#8e8a82",
        ember: "#c74c1c",
        forest: "#1f3a2e",
        line: "rgba(244,239,230,0.12)",
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', '"Noto Serif SC"', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1.15)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'shift': {
          '0%, 100%': { transform: 'translate(0,0)' },
          '50%': { transform: 'translate(-2px, 2px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22,1,0.36,1) forwards',
        'slow-zoom': 'slow-zoom 14s ease-in-out infinite alternate',
        'marquee': 'marquee 40s linear infinite',
        'blink': 'blink 2s ease-in-out infinite',
        'shift': 'shift 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
