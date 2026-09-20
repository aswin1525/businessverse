/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030508', // Deep Void
          900: '#070B12', // Obsidian Navy Base
          850: '#0C111C', // Surface Base
          800: '#121927', // Card & Panel Surface
          750: '#182133', // Elevated Surface
          700: '#1F2B42', // Card Border / Separator
          600: '#2E3F5F', // Muted Accent Border
          500: '#475B82', // Subtle Text
          400: '#7388AC', // Secondary Label Text
          300: '#9FB0CE', // Standard Body Text
          200: '#CBD6E8', // Emphasized Text
          100: '#E8EEF8', // Heading Text
          50: '#F5F8FD',
        },
        brand: {
          cyan: '#06B6D4',
          emerald: '#10B981',
          violet: '#8B5CF6',
          amber: '#F59E0B',
          blue: '#3B82F6',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'panel-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(6, 182, 212, 0.25)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-violet': '0 0 20px -5px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
}
