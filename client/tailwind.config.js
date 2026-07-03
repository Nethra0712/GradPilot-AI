/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Premium color system
        brand: {
          50: '#f0f4ff',
          100: '#d9e2ff',
          200: '#b8caff',
          300: '#8ca6ff',
          400: '#5c7aff',
          500: '#3855ff', // Primary Brand Blue
          600: '#2539e6',
          700: '#1c29b8',
          800: '#17208f',
          900: '#161d6e',
          950: '#0d1042',
        },
        slate: {
          950: '#090d16', // Dark mode deep background
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
