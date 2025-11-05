import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'rgb(var(--fg))',
        primary: 'rgb(var(--lg-primary))',
        'accent-1': 'rgb(var(--lg-accent-1))',
        'accent-2': 'rgb(var(--lg-accent-2))',
        'accent-3': 'rgb(var(--lg-accent-3))',
      },
      boxShadow: {
        liquid: 'var(--shadow-lg)',
      },
      backdropBlur: {
        soft: 'var(--blur-soft)',
        strong: 'var(--blur-strong)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'aurora-float': 'auroraFloat 8s ease-in-out infinite',
        'aurora-float-reverse': 'auroraFloat 10s ease-in-out infinite reverse',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        auroraFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(10px, -10px) scale(1.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config