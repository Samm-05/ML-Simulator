/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core Scientific Brand Palette Tokens
        midnight: '#090F15',
        mountainside: '#262E36',
        apres: '#6C6D74',
        slopes: '#B3B7BA',
        arctic: '#D3D1CE',

        // Semantic Colors (< 5% usage)
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Secondary Scale (Mapped to Brand Palette)
        secondary: {
          50: '#D3D1CE',
          100: '#B3B7BA',
          200: '#8E9195',
          300: '#6C6D74',
          400: '#484E55',
          500: '#353C44',
          600: '#262E36',
          700: '#1C232A',
          800: '#141A21',
          900: '#090F15',
          950: '#05080C',
        },

        // Primary Accent (Mapped to Slopes/Arctic Scale)
        primary: {
          50: '#F5F5F4',
          100: '#E7E6E4',
          200: '#D3D1CE',
          300: '#B3B7BA',
          400: '#95999D',
          500: '#6C6D74',
          600: '#484E55',
          700: '#262E36',
          800: '#141A21',
          900: '#090F15',
        },

        // Accent Scale
        accent: {
          500: '#B3B7BA',
          600: '#6C6D74',
        },
      },
      boxShadow: {
        soft: '0 4px 12px rgba(9, 15, 21, 0.4)',
        medium: '0 10px 24px rgba(9, 15, 21, 0.6)',
        hard: '0 20px 40px rgba(9, 15, 21, 0.8)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
