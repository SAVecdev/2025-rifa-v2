/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./src/**/*.js"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta de colores oscuros
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        primary: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b'
        },
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        }
      },
      backgroundColor: {
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
        'dark-hover': '#334155'
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        'gradient-primary': 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'dark': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 20px 40px rgba(0, 0, 0, 0.4)',
        'neon': '0 0 20px rgba(79, 70, 229, 0.5)'
      }
    },
  },
  plugins: [],
}
