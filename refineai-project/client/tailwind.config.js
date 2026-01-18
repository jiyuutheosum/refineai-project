/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
      },
      keyframes: {
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      fontFamily: {
        heading: 'inherit',
      },
    },
  },
  plugins: [],
}

